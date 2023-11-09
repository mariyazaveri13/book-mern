const express = require('express');
const Books = require('../model/Books');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let query = Books.find();
    let searchObj = {};
    let sortObj = {};

    if (req.query.searchByTitle) {
      searchObj.bookTitle = new RegExp(
        ['^', req.query.searchByTitle].join(''),
        'i'
      );
      //   query = query.find(searchObj).collation({ locale: 'en', strength: 2 });
    }
    if (req.query.searchByAuthor) {
      searchObj.authorName = new RegExp(
        ['^', req.query.searchByAuthor].join(''),
        'i'
      );
      //   query = query.find(searchObj).collation({ locale: 'en', strength: 2 });
    }

    if (req.query.sort == 'asc') {
      if (req.query.sortByTitle) {
        sortObj.bookTitle = 1;
      }
      if (req.query.sortByAuthor) {
        sortObj.authorName = 1;
      }
      if (req.query.sortByRating) {
        sortObj.rating = 1;
      }
    } else if (req.query.sort == 'desc') {
      if (req.query.sortByTitle) {
        sortObj.bookTitle = -1;
      }
      if (req.query.sortByAuthor) {
        sortObj.authorName = -1;
      }
      if (req.query.sortByRating) {
        sortObj.rating = -1;
      }
    }

    if (req.query.startDate || req.query.endDate) {
      const ltgt = {};

      if (req.query.startDate) {
        ltgt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const date = new Date(req.query.endDate);
        date.setDate(date.getDate() + 1);
        ltgt.$lte = date;
      }

      searchObj.firstPublishedDate = ltgt;
    }

    if (req.query.filterByGenre) {
      const arr = req.query.filterByGenre.split(',');
      searchObj.genre = arr;
    }

    const data = await query.find(searchObj);
    return res.status(200).json({
      message: 'Ok',
      count: data.length,
      books: data,
    });
  } catch (error) {
    res.status(403).json({
      error: error.message,
    });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await Books.create(req.body);
    return res.status(201).json({
      message: `Book added successfully with id ${data._id}`,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const oldData = await Books.findById(req.params.id);
    if (oldData && oldData.shelf === 'Read') {
      return res.status(400).json({
        message: 'Cannot update the status of read book',
      });
    } else if (oldData) {
      req.body.updatedAt = new Date();
      const newData = await Books.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
      });
      return res.status(200).json({
        message: 'Updated successfully',
      });
    } else {
      return res.status(404).json({
        message: 'No book found with the provided id',
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const oldData = await Books.findById(req.params.id);
    if (oldData) {
      await findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: 'Deleted successfully',
      });
    } else {
      return res.status(404).json({
        message: 'Resource not found with given ID',
      });
    }
  } catch (error) {}
});

module.exports = router;
