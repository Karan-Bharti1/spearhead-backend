# Spearhead-backend

Spearhead is a CRM app will focus on lead management with defined steps for each lead's lifecycle.
We will assign sales agents to leads and allow users to add comments or updates to each lead.

[For Frontend Code Refer](https://github.com/Karan-Bharti1/Spearhead)

## Author

- [@Karan-Bharti1](https://github.com/Karan-Bharti1)



## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and Node.js). I'm passionate about building dynamic, user-friendly web applications and continuously improving my skills.

## Tech Stack

**Frontend:** React, React Router for URL-based filtering, Axios for API calls, Chart.js for visualizations,Redux-Toolkit for state management.

**Backend:** Express.js with RESTful APIs, Mongoose for database interactions with MongoDB.

**Database:** MongoDB with models for leads, sales agents, comments, and tags.

## Key API'S

- API to add new sales agent
- API to get all sales Agents
- API to create new lead
- API to get all leads (Helps to implement url based filtering for data as well)
- API to update leads data
- API to delete any lead from the database
- API to get total number of leads in the pipeline
- API to create comment for any lead by assigned agent
- API to get all comments for any lead by lead id
- API to get leads that were with closed status and of last week
- API to get all tags data


## Mongoose Models

### Comments

```javascript
const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',  // Reference to the Lead model
    required: [true, 'Lead reference is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',  // Reference to the SalesAgent who authored the comment
    required: [true, 'Author is required'],
  },
  commentText: {
    type: String,
    required: [true, 'Comment text is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the creation time
  }
});

module.exports = mongoose.model('Comment', commentSchema);

```

  ### Leads

```javascript
const mongoose = require('mongoose');

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
  },
  source: {
    type: String,
    required: [true, 'Lead source is required'],
    enum: ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'],  // Predefined lead sources
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',  // Reference to SalesAgent model
    required: [true, 'Sales Agent is required'],
  },
  status: {
    type: String,
    required: true,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'],  // Predefined lead statuses
    default: 'New',
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId
    , ref: "Tag"  
  }],
  timeToClose: {
    type: Number,
    required: [true, 'Time to Close is required'],
    min: [1, 'Time to Close must be a positive number'],  // Positive integer validation
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Medium', 'Low'],  // Predefined priority levels
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,  // The date when the lead was closed (optional, used when status is "Closed")
  },
});

// Middleware to update the `updatedAt` field on each save
leadSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lead', leadSchema);

```

### Sales Agent

```javascript
const mongoose = require('mongoose');

// Sales Agent Schema
const salesAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sales Agent name is required'],
  },
  email: {
    type: String,
    required: [true, 'Sales Agent email is required'],
    unique: true,  // Email must be unique across agents
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('SalesAgent', salesAgentSchema);

```

### Tags

```javascript
const mongoose = require('mongoose');

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,  // Ensures that each tag name is unique
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Tag', tagSchema);

```

## Middlewares and Cors

```javascript
app.use(express.json())// Middleware
const cors=require('cors')
const corsOptions={
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))// Cors
```
