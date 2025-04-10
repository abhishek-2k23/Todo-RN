import mongoose, { Document, Schema } from 'mongoose';

export enum PriorityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}


export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  completedAt: Date;
  dueDate?: Date;
  priority?: PriorityLevel;
  createdAt: Date;
  updatedAt: Date;
}


const TodoSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  priority: {
    type: String,
    enum: Object.values(PriorityLevel),
    default: PriorityLevel.LOW
  },
}, {
  timestamps: true
});

// Middleware to track completion history
TodoSchema.pre('save', function(next) {
  if (this.isModified('completed') && this.completed) {
    const historyEntry = {
      completedAt: new Date(),
      completedBy: this.get('completedBy'),
      notes: this.get('completionNotes')
    };
    this.completionHistory.push(historyEntry);
  }
  next();
});

export default mongoose.model<ITodo>('Todo', TodoSchema); 