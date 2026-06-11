import { type NextRequest, NextResponse } from "next/server";

import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { getLogger } from "@/core/logging";
import { getSessionUser } from "@/features/auth/service";
import { deleteProject, getProject, UpdateProjectSchema, updateProject } from "@/features/projects";

const logger = getLogger("api.projects");

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Get a single project by ID.
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getSessionUser();
    const { id } = await params;

    logger.info({ projectId: id }, "project.get_started");

    const project = await getProject(id, user?.id ?? null);

    logger.info({ projectId: id }, "project.get_completed");

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/projects/[id]
 * Update a project.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const body = await request.json();
    const input = UpdateProjectSchema.parse(body);

    logger.info({ projectId: id }, "project.update_started");

    const project = await updateProject(id, input, user.id);

    logger.info({ projectId: id }, "project.update_completed");

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project.
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    logger.info({ projectId: id }, "project.delete_started");

    await deleteProject(id, user.id);

    logger.info({ projectId: id }, "project.delete_completed");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
