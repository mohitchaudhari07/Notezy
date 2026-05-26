const resourceService = require("../services/resource.service");
const cloudinaryService = require("../services/cloudinary.service");
const { queueSummaryGeneration } = require("../jobs/summaryGenerator.job");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const University = require("../models/University");
const Branch = require("../models/Branch");
const Subject = require("../models/Subject");

const uploadResource = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a PDF or image document file");
  }

  const { title, type, examType, year, semester, subject, branch, university } =
    req.body;

  // Verify mappings exist before saving
  const uniExists = await University.findById(university);
  if (!uniExists) throw new ApiError(404, "University not found");

  const branchExists = await Branch.findById(branch);
  if (!branchExists) throw new ApiError(404, "Branch not found");

  const subExists = await Subject.findById(subject);
  if (!subExists) throw new ApiError(404, "Subject not found");

  console.log(`\n🔹 [Controller] Uploading resource file to Cloudinary...`);
  // Upload to Cloudinary folder named after academic university
  const cloudinaryFolder = `engipyq/${uniExists.slug}/${type.toLowerCase()}s`;
  const uploadResult = await cloudinaryService.uploadBuffer(
    req.file.buffer,
    cloudinaryFolder,
    "auto",
  );

  const resource = await resourceService.uploadResource({
    title,
    type,
    examType,
    year: Number(year),
    semester: Number(semester),
    subject,
    branch,
    university,
    fileUrl: uploadResult.url,
    cloudinaryPublicId: uploadResult.publicId,
    fileSize: uploadResult.bytes || req.file.size,
    uploadedBy: req.user._id,
    isApproved: req.user.role !== "student", // Auto approve admins/moderators uploads
  });

  // If it's a PDF and auto-approved or moderator, queue summary generation asynchronously
  if (req.file.mimetype === "application/pdf" && resource.isApproved) {
    await queueSummaryGeneration(resource._id);
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        resource,
        "Resource uploaded successfully" +
          (resource.isApproved ? "" : ". Awaiting review."),
      ),
    );
});

const listResources = asyncHandler(async (req, res) => {
  const { type, university, branch, semester, subject, query, page, limit } =
    req.query;


  const result = await resourceService.getResources({
    type,
    universitySlug: university,
    branchSlug: branch,
    semester,
    subjectSlug: subject,
    query,
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Resources retrieved successfully"));
});

const getResourceDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resource = await resourceService.getResourceById(id);

  // Track visual count
  await resourceService.incrementViewCount(id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, resource, "Resource details retrieved successfully"),
    );
});

const downloadResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resource = await resourceService.getResourceById(id);

  // Track download history or increment download counters
  await resourceService.incrementDownloadCount(id);

  // Return the direct secure file url
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { downloadUrl: resource.fileUrl },
        "Download link prepared successfully",
      ),
    );
});

const getCatalogUniversities = asyncHandler(async (req, res) => {
  const result = await resourceService.getCatalogUniversities();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Catalog universities retrieved successfully",
      ),
    );
});

const getCatalogStreams = asyncHandler(async (req, res) => {
  const result = await resourceService.getCatalogStreams();
  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Catalog streams retrieved successfully"),
    );
});

const getCatalogSubjects = asyncHandler(async (req, res) => {
  const { branch, academicYear } = req.query;
  if (!branch || !academicYear) {
    throw new ApiError(400, "Branch and academicYear are required parameters");
  }
  const result = await resourceService.getCatalogSubjects(branch, academicYear);
  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Catalog subjects retrieved successfully"),
    );
});

const getCatalogPapers = asyncHandler(async (req, res) => {
  const { branch, academicYear, subject, examType, examYear, page, limit } =
    req.query;
  if (!branch || !academicYear) {
    throw new ApiError(400, "Branch and academicYear are required parameters");
  }
  const result = await resourceService.getCatalogPapers({
    branch,
    academicYear,
    subject,
    examType,
    examYear,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Catalog papers retrieved successfully"),
    );
});

const getCatalogPaperDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await resourceService.getPaperById(id);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Catalog paper details retrieved successfully",
      ),
    );
});

const searchCatalogPapers = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await resourceService.searchCatalogPapers(
    q,
    page ? Number(page) : 1,
    limit ? Number(limit) : 20,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Catalog search completed successfully"),
    );
});

module.exports = {
  uploadResource,
  listResources,
  getResourceDetails,
  downloadResource,
  getCatalogUniversities,
  getCatalogStreams,
  getCatalogSubjects,
  getCatalogPapers,
  getCatalogPaperDetails,
  searchCatalogPapers,
};
