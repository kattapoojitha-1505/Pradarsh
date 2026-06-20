from app.database.supabase import supabase
from fastapi import HTTPException
from typing import Optional, List


class SearchService:
    """
    Handles search and filter queries for projects.
    Supports:
      - Full-text search on project title (ilike)
      - Developer name search (via profiles join)
      - Category filter (exact match)
      - Technology filter (array overlap)
      - Pagination
    """

    def search_projects(
        self,
        q: Optional[str] = None,
        category: Optional[str] = None,
        technologies: Optional[List[str]] = None,
        page: int = 1,
        limit: int = 12,
    ) -> dict:
        """
        Search and filter published projects.
        Returns { data: [...], total: int }
        """
        try:
            offset = (page - 1) * limit

            # ── Strategy: fetch matching project IDs from title search,
            #    then also fetch IDs from developer name search, merge them.
            #    Apply category + tech filters on the merged set via Supabase.

            # Build base query for published projects with author join
            base_query = (
                supabase.table("projects").select(
                    "*, profiles!projects_user_id_fkey(full_name, username, avatar_url)",
                    count="exact",
                )
                .eq("status", "published")
            )

            # ── Category filter
            if category and category.lower() != "all":
                base_query = base_query.eq("category", category)

            # ── Technology filter (array overlap using contains)
            if technologies:
                # Filter projects where technologies array contains ANY of the given techs
                for tech in technologies:
                    base_query = base_query.ilike("technologies", f"%{tech}%")

            # ── Text search: title OR developer name
            if q and q.strip():
                q_clean = q.strip()

                # Search by title
                title_query = (
                    supabase.table("projects")
                    .select("id")
                    .eq("status", "published")
                    .ilike("title", f"%{q_clean}%")
                    .execute()
                )
                title_ids = [p["id"] for p in (title_query.data or [])]

                # Search by developer name via profiles
                dev_query = (
                    supabase.table("profiles")
                    .select("id")
                    .ilike("full_name", f"%{q_clean}%")
                    .execute()
                )
                dev_user_ids = [p["id"] for p in (dev_query.data or [])]

                # Get project IDs for matching developers
                dev_project_ids = []
                if dev_user_ids:
                    dev_projects_query = (
                        supabase.table("projects")
                        .select("id")
                        .eq("status", "published")
                        .in_("user_id", dev_user_ids)
                        .execute()
                    )
                    dev_project_ids = [p["id"] for p in (dev_projects_query.data or [])]

                # Merge unique IDs
                all_matching_ids = list(set(title_ids + dev_project_ids))

                if not all_matching_ids:
                    return {"data": [], "total": 0}

                # Filter main query to matching IDs
                base_query = base_query.in_("id", all_matching_ids)

            # ── Execute with pagination
            response = (
                base_query
                .order("created_at", desc=True)
                .range(offset, offset + limit - 1)
                .execute()
            )

            total = response.count or 0

            # Flatten author info
            projects = []
            for p in (response.data or []):
                profile = p.pop("profiles", {}) or {}
                p["author_name"] = profile.get("full_name", "")
                p["author_username"] = profile.get("username", "")
                p["author_avatar"] = profile.get("avatar_url", "")
                projects.append(p)

            return {"data": projects, "total": total}

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


search_service = SearchService()
