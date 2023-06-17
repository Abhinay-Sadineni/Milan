import express, { Router } from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

const app = express();

const router = express.Router();

dotenv.config();

//you have to get the credentials from google cloud platform and save it in credentials.json file
const auth =new google.auth.GoogleAuth({
    keyFile : "credentials.json",
    scopes :"https://www.googleapis.com/auth/spreadsheets"
  })
  

//create client instance for auth 
const client = await auth.getClient();

//created instance of google sheets api
const googlesheets = google.sheets({version : 'v4' ,auth: client});

//this value should be in environemnt variable
const spreadsheetID = process.env.SPREADSHEET_ID;



//get the data
router.get('/',async(req,res)=>
{
   try {
    console.log(req.body);
    const getRows =await googlesheets.spreadsheets.values.get({
        auth :auth,
        spreadsheetId:spreadsheetID,
        range: "Sheet1"
        })
        res.json(getRows.data.values);
   }
   catch (error) {
       res.json({message : error});
   }
});


//add the data
router.post('/add',async(req,res)=>{
    try {
        console.log(req.body);
        const post = req.body;
        const resource = {  
            values :[[post.name,post.email,post.password]]
        }
         const addRow =await googlesheets.spreadsheets.values.append({
                auth :auth,
                spreadsheetId:spreadsheetID,
                range: "Sheet1",
                resource : resource,
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS'

              })
              res.json(addRow.data);
            }
    catch (error) {
        res.json({message : error});
    }
});


//delete the data
router.get('/delete/:id',async(req,res)=>{
    try {
       const id = req.params.id;
        const deleteRow =await googlesheets.spreadsheets.values.clear({
                auth :auth,
                spreadsheetId:spreadsheetID,
                range: "Sheet1!A"+id+":C"+id,
        })
        res.json(deleteRow.data);
    }
    catch (error) {
        res.json({message : error});
    }
})

//update the data
router.post('/update',async(req,res)=>{
    try {
        console.log(req.body);
        const post = req.body;
        const resource = {  
            values :[[post.name,post.email,post.password]]
        }
         const updateRow =await googlesheets.spreadsheets.values.update({
                auth :auth,
                spreadsheetId:spreadsheetID,
                range: "Sheet1!A"+post.row_number+":C"+post.row_number,
                resource : resource,
                valueInputOption: 'USER_ENTERED',

              })
              res.json(updateRow.data);
            }
    catch (error) {
        res.json({message : error});
    }
})

export default router;