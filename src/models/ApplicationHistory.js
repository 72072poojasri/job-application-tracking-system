const session = await mongoose.startSession();
session.startTransaction();

try {
  application.stage = newStage;
  await application.save({ session });

  await ApplicationHistory.create([{
    application: application._id,
    from: oldStage,
    to: newStage,
    changedBy: user._id
  }], { session });

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
