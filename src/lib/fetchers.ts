import axios from "axios"

import type {
  DeployDialogFormValues,
  DeployItemResponse,
  DeployItemsResponse,
  DeploySubmissionResponse,
} from "@/lib/type"

export async function submitDeployConfiguration(
  payload: DeployDialogFormValues
): Promise<DeploySubmissionResponse> {
  const response = await axios.post<DeploySubmissionResponse>("/api/deploy", payload)
  return response.data
}

export async function fetchDeployItems(): Promise<DeployItemsResponse> {
  const response = await axios.get<DeployItemsResponse>("/api/deploy")
  return response.data
}

export async function fetchDeployItemById(id: string): Promise<DeployItemResponse> {
  const response = await axios.get<DeployItemResponse>(
    `/api/deploy/${encodeURIComponent(id)}`
  )
  return response.data
}
