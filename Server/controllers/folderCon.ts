export const createFolder = async(req, res) => {
  try {
    const {userId, name} = req.body;
    // 
    console.log(name, '----------')
    const folderList = []
    res.status(200).json(folderList);
  } catch(err) {
    res.status(409).json({ message: err.message });
  }
}