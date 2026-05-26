export function getResourceId(resource) {
  return resource?._id || resource?.id || "";
}

function getRefValue(ref, key, fallback = "") {
  if (!ref) return fallback;
  if (typeof ref === "string") return ref;
  return ref[key] || fallback;
}

function formatNumber(value) {
  const number = Number(value || 0);
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`;
  }
  return String(number);
}

export function normalizeResource(resource = {}) {
  const id = getResourceId(resource);
  const subjectCode =
    resource.subjectCode ||
    getRefValue(resource.subject, "code") ||
    getRefValue(resource.subject, "name", "Subject");

  return {
    ...resource,
    id,
    type: resource.type || "Notes",
    title: resource.title || "Untitled resource",
    subjectCode,
    subjectName: getRefValue(resource.subject, "name", subjectCode),
    branchName: getRefValue(resource.branch, "name"),
    universityName:
      getRefValue(resource.university, "shortName") ||
      getRefValue(resource.university, "name"),
    year: resource.year || resource.academicYear || "Year",
    semester: resource.semester,
    views: resource.views || formatNumber(resource.viewsCount),
    downloads: resource.downloads || formatNumber(resource.downloadsCount),
    rating: resource.rating || "4.8",
    fileUrl: resource.fileUrl || resource.downloadUrl || "",
  };
}

export function normalizeResourceList(data) {
  const resources = Array.isArray(data) ? data : data?.resources || [];
  return resources.map(normalizeResource);
}
