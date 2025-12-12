exports.getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find project
    const homeData = await Home.findOne({ id: Number(id) });

    if (!homeData) {
      return res.status(404).json({ message: "Project not found in home table" });
    }

    const newDetails = new ProjectDetails({
      projectId: homeData.id,
      projectName: homeData.projectName,
      houseNumbers: homeData.houseNumbers,
      perHouseCost: homeData.perHouseCost,
      totalHouseCost: homeData.totalHouseCost,
      location: homeData.location,
      projectType: homeData.projectType,
      wingsOrPlots: homeData.wingsOrPlots,
    });

    await newDetails.save();

    res.status(201).json({
      message: "Project details fetched successfully",
      projectDetails: newDetails,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching project details",
      error: err.message,
    });
  }
};
