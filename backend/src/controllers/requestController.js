const {
  createServiceRequest,
  getRequestsByUserId,
  getAllRequests,
  updateRequestStatus,
  deleteRequestById,
} = require('../models/requestModel');

const createRequest = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const request = await createServiceRequest({
      userId: req.user.id,
      title,
      description,
      category,
      priority,
    });

    return res.status(201).json({
      message: 'Service request created successfully',
      request,
    });
  } catch (error) {
    return next(error);
  }
};

const getUserRequests = async (req, res, next) => {
  try {
    const requests = await getRequestsByUserId(req.user.id);
    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
};

const getRequestsForAdmin = async (req, res, next) => {
  try {
    const { search = '', status = '' } = req.query;
    const requests = await getAllRequests({ search, status });
    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
};

const changeRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedRequest = await updateRequestStatus({
      requestId: id,
      status,
    });

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({
      message: 'Request status updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    return next(error);
  }
};

const removeRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteRequestById(id);

    if (!isDeleted) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRequest,
  getUserRequests,
  getRequestsForAdmin,
  changeRequestStatus,
  removeRequest,
};