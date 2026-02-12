import axios from "axios"

import type { DeployDialogFormValues, DeploySubmissionResponse } from "@/lib/type"

export async function submitDeployConfiguration(
  payload: DeployDialogFormValues
): Promise<DeploySubmissionResponse> {
  const response = await axios.post<DeploySubmissionResponse>("/api/deploy", payload)
  return response.data
}
