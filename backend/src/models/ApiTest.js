// backend/src/models/ApiTest.js
// This defines the structure of our API test results in MongoDB

const mongoose = require('mongoose');

// Define the schema (blueprint) for API test results
const apiTestSchema = new mongoose.Schema(
  {
    // Which API we're testing
    apiName: {
      type: String,
      required: true,
      trim: true,
    },

    // The API endpoint URL
    apiUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // HTTP status code (200, 404, 500, etc.)
    statusCode: {
      type: Number,
      required: true,
    },

    // Response time in milliseconds
    responseTime: {
      type: Number,
      required: true,
    },

    // Is the API up or down?
    status: {
      type: String,
      enum: ['UP', 'DOWN', 'SLOW'],
      default: 'UP',
    },

    // Any error message if API failed
    errorMessage: {
      type: String,
      default: null,
    },

    // When was this test performed
    testedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create indexes for faster queries
apiTestSchema.index({ apiName: 1, testedAt: -1 });

// Create and export the model
const ApiTest = mongoose.model('ApiTest', apiTestSchema);

module.exports = ApiTest;

/*
EXPLANATION:

1. Schema - Defines what fields our data has and their types
2. required: true - This field MUST have a value
3. trim: true - Removes extra spaces
4. enum - Only allows specific values ('UP', 'DOWN', 'SLOW')
5. default - Value used if none provided
6. timestamps - Auto-adds createdAt and updatedAt fields
7. index - Makes searching by apiName and date faster

THINK OF IT LIKE:
This is like creating a form template. Every API test result
will have these exact fields filled out.

EXAMPLE DATA:
{
  apiName: "GitHub API",
  apiUrl: "https://api.github.com",
  statusCode: 200,
  responseTime: 145,
  status: "UP",
  errorMessage: null,
  testedAt: "2024-12-30T10:30:00.000Z"
}
*/