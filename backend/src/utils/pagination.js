const validatePagination = (page, limit) => {
  page = parseInt(page);
  limit = parseInt(limit);

  page = Number.isNaN(page) || page < 1 ? 1 : page;
  limit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

  limit = Math.min(limit, 50);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

module.exports = validatePagination;