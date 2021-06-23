const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

exports.uploadImage = (req,res) => {
    try{
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No files were uploaded.'})
       // res.json({msg:"image upload"})

       if(req.files[''].size > 1024*1024){
            // removeTmp(req.files[''].tempFilePath) 
            return res.status(400).json({msg: 'Size too large'}) 
        }   

        if(req.files[''].mimetype !== 'image/jpeg' && req.files[''].mimetype !== 'image/png') {
            removeTmp(req.files[''].tempFilePath) 
            return res.status(400).json({msg: "File format is incorrect."})
        }

        cloudinary.v2.uploader.upload(req.files[''].tempFilePath, {folder: "test"}, async(err, result) => {
            if(err) throw err;
           
            removeTmp(req.files[''].tempFilePath)
            
            res.json({public_id: result.public_id, url: result.secure_url})
        }) 

        // after upload the image on cloudinary then we need to delete the temp folder that is create on our server local folder.
        // for that we have used removeTmp().
    }catch (err){
        res.status(500).json({msg: err.message})
    }
}


const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}



// delete the image on clodinary

exports.deleteImage = (req,res) => {
    try {
        const {public_id} = req.body;

        console.log(req.body);

        if(!public_id) return res.status(400).json({msg: 'No images selected'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if(err) throw err;

            res.json({msg: 'Deleted image'})
        })

    } catch(err) {
        return res.status(500).json({msg: err.message})
    }
}