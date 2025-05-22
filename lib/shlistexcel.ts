// /lib/shlistexcel.ts
export interface DownloadParams {
  wr_year?: string;
  wr_cate?: string;
  wr_name?: string;
  wr_state?: string;
}

export function downloadExcelFile(params: DownloadParams, filename = "shlist.xlsx") {
  const query = new URLSearchParams();

  if (params.wr_year) query.append("wr_year", params.wr_year);
  if (params.wr_cate) query.append("wr_cate", params.wr_cate);
  if (params.wr_name) query.append("wr_name", params.wr_name);
  if (params.wr_state) query.append("wr_state", params.wr_state);

  const queryString = query.toString();
  const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shlistexcel-download?${queryString}`;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
