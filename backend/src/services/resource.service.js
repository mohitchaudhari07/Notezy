const Resource = require("../models/Resource");
const Subject = require("../models/Subject");
const University = require("../models/University");
const Branch = require("../models/Branch");
const ApiError = require("../utils/ApiError");
const QuestionPaper = require("../models/QuestionPaper");
const validatePagination = require("../utils/pagination");

class ResourceService {
  async getResources({
    type,
    universitySlug,
    branchSlug,
    semester,
    subjectSlug,
    query,
    page = 1,
    limit = 10,
  }) {
    const filter = { isApproved: true };

    // Core filters based on relations
    if (type) filter.type = type;

    if (universitySlug) {
      const university = await University.findOne({ slug: universitySlug });
      if (!university) throw new ApiError(404, "University not found");
      filter.university = university._id;
    }

    if (branchSlug) {
      const branch = await Branch.findOne({ slug: branchSlug });
      if (!branch) throw new ApiError(404, "Branch not found");
      filter.branch = branch._id;
    }

    if (semester) {
      filter.semester = Number(semester);
    }

    if (subjectSlug) {
      const subject = await Subject.findOne({ slug: subjectSlug });
      if (!subject) throw new ApiError(404, "Subject not found");
      filter.subject = subject._id;
    }

    // Text search filter
    if (query) {
      filter.$text = { $search: query };
    }
    const {
      page: validPage,
      limit: validLimit,
      skip,
    } = validatePagination(page, limit);

    const resources = await Resource.find(filter)
      .lean() // Populate related fields for better frontend display
      .populate("subject", "name code")
      .populate("branch", "name code")
      .populate("university", "name shortName")
      .populate("uploadedBy", "name")
      .skip(skip)
      .limit(validLimit)
      .sort({ createdAt: -1 });

    const totalCount = await Resource.countDocuments(filter);

    return {
      resources,
      totalPages: Math.ceil(totalCount / validLimit),
      currentPage: validPage,
      totalCount,
    };
  }

  async getResourceById(id) {
    const resource = await Resource.findOne({
      _id: id,
      isApproved: true,
    })
      .populate("subject")
      .populate("branch")
      .populate("university")
      .populate("uploadedBy", "name");

    if (!resource) {
      throw new ApiError(404, "Resource not found");
    }
    return resource;
  }

  async uploadResource(resourceData, fileBuffer) {
    // Business logic for handling uploading (triggers Cloudinary service externally)
    // Returns created Resource Mongoose Model
    const resource = await Resource.create(resourceData);
    return resource;
  }

  async incrementViewCount(id) {
    return await Resource.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true },
    );
  }

  async incrementDownloadCount(id) {
    return await Resource.findByIdAndUpdate(
      id,
      { $inc: { downloadsCount: 1 } },
      { new: true },
    );
  }

  // Get all distinct universities in the catalog
  async getCatalogUniversities() {
    return await QuestionPaper.distinct("university");
  }

  // Get all distinct streams in the catalog
  async getCatalogStreams() {
    const streams = await QuestionPaper.distinct("branch");
    return streams.filter(Boolean).sort();
  }

  // Helper to map UI year selections to db query conditions
  getYearQueryCondition(branch, academicYear) {
    const yearStr = academicYear?.toString().toUpperCase();

    // First Year mapping (FE)
    if (yearStr === "FE" || yearStr === "FIRST YEAR" || yearStr === "1") {
      return {
        branch: "First Year",
      };
    }

    // Second Year mapping (SE)
    if (yearStr === "SE" || yearStr === "SECOND YEAR" || yearStr === "2") {
      return {
        branch: branch,
        academicYear: "SE",
      };
    }

    // Third Year mapping (TE)
    if (yearStr === "TE" || yearStr === "THIRD YEAR" || yearStr === "3") {
      return {
        branch: branch,
        academicYear: "TE",
      };
    }

    // Fourth Year mapping (BE)
    if (yearStr === "BE" || yearStr === "FOURTH YEAR" || yearStr === "4") {
      return {
        branch: branch,
        academicYear: { $in: ["BE", "Fourth Year"] },
      };
    }

    // General fallback
    return {
      branch: branch,
      academicYear: academicYear,
    };
  }

  // Get all subjects for a given stream and year
  async getCatalogSubjects(branch, academicYear) {
    const condition = this.getYearQueryCondition(branch, academicYear);

    // If it's the First Year branch, subjects are stored in the 'pattern' field!
    const fieldToQuery =
      condition.branch === "First Year" ? "pattern" : "subject";

    const subjects = await QuestionPaper.distinct(fieldToQuery, condition);
    return subjects.filter(Boolean).sort();
  }

  // Get question papers for a specific subject (with pagination)
  async getCatalogPapers({
    branch,
    academicYear,
    subject,
    examType,
    examYear,
    page = 1,
    limit = 20,
  }) {
    const yearCondition = this.getYearQueryCondition(branch, academicYear);

    const filter = {
      ...yearCondition,
    };

    if (subject) {
      // If it's the First Year branch, subject is mapped to the 'pattern' field!
      if (yearCondition.branch === "First Year") {
        filter.pattern = subject;
      } else {
        filter.subject = subject;
      }
    }
    if (examType) {
      filter.examType = examType;
    }
    if (examYear) {
      filter.examYear = Number(examYear);
    }

    const skip = (page - 1) * limit;

    const papers = await QuestionPaper.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ examYear: -1, examType: 1 });

    const totalCount = await QuestionPaper.countDocuments(filter);

    return {
      papers,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount,
    };
  }

  // Get details for a single paper
  async getPaperById(id) {
    const paper = await QuestionPaper.findById(id);
    if (!paper) {
      throw new ApiError(404, "Question paper not found");
    }
    return paper;
  }

  // Global search over questionpapers collection
  async searchCatalogPapers(query, page = 1, limit = 20) {
    if (!query) {
      return { papers: [], totalCount: 0, totalPages: 0, currentPage: page };
    }

    const regex = new RegExp(query, "i");
    const filter = {
      $or: [
        { subject: regex },
        { branch: regex },
        { university: regex },
        { pattern: regex },
        { fileName: regex },
      ],
    };

    const skip = (page - 1) * limit;
    const papers = await QuestionPaper.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ examYear: -1 });

    const totalCount = await QuestionPaper.countDocuments(filter);

    return {
      papers,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount,
    };
  }
}

module.exports = new ResourceService();
