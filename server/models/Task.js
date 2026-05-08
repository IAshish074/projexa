const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a comment text']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['todo', 'pending', 'in-progress', 'completed'],
      default: 'todo'
    },
    dueDate: {
      type: Date
    },
    comments: [CommentSchema],
    attachments: [
      {
        fileName: String,
        filePath: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Call updateProjectProgress after save/remove
TaskSchema.post('save', function() {
  this.constructor.updateProjectProgress(this.project);
});

TaskSchema.post('remove', function() {
  this.constructor.updateProjectProgress(this.project);
});

// Static method to calculate and update project progress
TaskSchema.statics.updateProjectProgress = async function(projectId) {
  const obj = await this.aggregate([
    {
      $match: { project: projectId }
    },
    {
      $group: {
        _id: '$project',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  try {
    if (obj[0]) {
      const progress = Math.round((obj[0].completedTasks / obj[0].totalTasks) * 100);
      await this.model('Project').findByIdAndUpdate(projectId, { progress });
    } else {
      await this.model('Project').findByIdAndUpdate(projectId, { progress: 0 });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model('Task', TaskSchema);
