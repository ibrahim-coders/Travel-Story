const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const config = require('./config.json');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const upload = require('./multer');
const User = require('./models/user.models');

const TrvelStory = require('./models/travelStory.models');
const { authenticateToken } = require('./utilitie');

require('dotenv').config();
const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: 'https://travel-story-mauve.vercel.app',
  })
);
//serve static files uploads

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'assets')));

// creact account
app.post('/create-account', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: 'All fields are required' });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '72h' }
    );

    return res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: 'Registration Successful',
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

//login

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: true, message: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '72h' }
    );

    return res.json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: 'Login Successful',
    });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Server error' });
  }
});

//get user

app.get('/get-user', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const isUser = await User.findOne({ _id: userId });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: isUser,
    message: '',
  });
});

//get travle story
app.get('/get-all-stories', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const trvelStories = await TrvelStory.find({ userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({ stories: trvelStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
//add travel story
app.post('/add-travel-story', authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitDate) {
    return res
      .status(400)
      .json({ error: true, message: 'All fields are required' });
  }

  const parseVisitedDate = new Date(parseInt(visitDate));

  try {
    const travelStory = new TrvelStory({
      title,
      story,
      visitedLocation,
      visitDate: parseVisitedDate,
      imageUrl,
      userId,
    });

    await travelStory.save();
    res.status(201).json({ story: travelStory, message: 'Added successfully' });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

//delete  an image from the folder

app.delete('/delete-image', async (req, res) => {
  const { imageUrl } = req.query;
  console.log(imageUrl);

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: 'ImageUrl parameter is required' });
  }
  try {
    const filename = path.basename(imageUrl);
    const filepath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(200).json({ error: true, message: 'Image not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//serve static files uploads

//image upload
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file?.filename) {
      return res
        .status(400)
        .json({ error: true, message: 'No image uploaded' });
    }
    const imageUrl = `https://travel-story-n9dx.vercel.app/uploads/${req.file?.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Edit travle story

app.put('/edit-story/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitDate) {
    return res
      .status(400)
      .json({ error: true, message: 'All fields are required' });
  }

  const parseVisitedDate = new Date(parseInt(visitDate));

  try {
    const travelStory = await TrvelStory.findOne({ _id: id, userId });
    if (!travelStory) {
      return res
        .status(400)
        .json({ error: true, message: 'Travel story not found' });
    }

    //  image has changed
    if (travelStory.imageUrl && travelStory.imageUrl !== imageUrl) {
      const oldImagePath = path.join(
        __dirname,
        'uploads',
        path.basename(travelStory.imageUrl)
      );

      if (!travelStory.imageUrl.includes('placeholder')) {
        fs.unlink(oldImagePath, err => {
          if (err) console.error('Error deleting old image:', err.message);
        });
      }
    }

    // Update fields
    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl;
    travelStory.visitDate = parseVisitedDate;

    await travelStory.save();

    res.status(200).json({
      story: travelStory,
      message: 'Updated successfully',
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//deleted travel story

app.delete('/delete-story/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TrvelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res
        .status(400)
        .json({ error: true, message: 'Travel story not found' });
    }

    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, 'uploads', filename);

    // Delete the image file first
    fs.unlink(filePath, async err => {
      if (err) {
        console.error('Failed to delete image file:', err);
        return res
          .status(500)
          .json({ error: true, message: 'Image delete failed' });
      }

      // Delete story from DB
      await travelStory.deleteOne();
      return res
        .status(200)
        .json({ message: 'Travel story deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: error.message });
  }
});

//isFavourite
app.put('/updated-favourite/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TrvelStory.findOne({ _id: id, userId: userId });
    if (!travelStory) {
      return res
        .status(400)
        .json({ error: true, message: 'Travel story not found' });
    }
    travelStory.isFavourite = isFavourite;

    await travelStory.save();

    res
      .status(200)
      .json({ story: travelStory, message: 'Updated successfully' });
  } catch (error) {
    res
      .status(200)
      .json({ story: travelStory, message: 'Updated successfully' });
  }
});

//Search travle story
app.post('/search-story', authenticateToken, async (req, res) => {
  const { query } = req.body;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: 'Query is required' });
  }
  try {
    const searchResult = await TrvelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { story: { $regex: query, $options: 'i' } },
        { visitedLocation: { $regex: query, $options: 'i' } },
      ],
    }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: searchResult, message: 'Search result' });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//filter

app.get('/travle-story/filter', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));
    const filteredStories = await TrvelStory.find({
      userId: userId,
      visitDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// server run
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
