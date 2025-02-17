const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model')
const LeaveApplication = require('../models/leaveApplication.model')
const Stat = require('../models/stats.model')

router.post('/', async(req, res)=>{     // create New Leave application
    try{
        const newleave = new LeaveApplication(req.body)
        const ans = await Employee.findOne({EmployeeID:newleave.ApplicantEmployeeID})
        newleave.ResponsibleManagerID = ans.Manager
        var query =  await Stat.findOneAndUpdate({},       // to increment no. of employees which will define employee ID
        {$inc:{NoOfApplication:1}},
        {new:true});
        newleave.ApplicationNumber = query.NoOfApplication
        const result = await LeaveApplication.create(newleave);
        res.send(`${result.ApplicationNumber} successfully created!!`)
    }catch(err){
        res.json(err)
    }
});

router.post('/:id', async(req, res)=>{     // Approve Leave application
    try{
        // here var name is temp, boolval will be later changed to actual name
        if(req.body.boolval) {
            const lapplication = LeaveApplication.findOneAndUpdate({ApplicationNumber: req.params.id}, {ApplicationStatus: "Approved"});
        } else {
            const lapplication = LeaveApplication.findOneAndUpdate({ApplicationNumber: req.params.id}, {ApplicationStatus: "Rejected"});
        }
        res.send(200);
    }catch(err){
        res.json(err)
    }
});

router.get('/:id', async function(req, res){   // All leave appllication of a particular manager
    try{
        const query = await LeaveApplication.find({ResponsibleManagerID:req.params.id});
        console.log(query) ;
        res.json(query);
    }
    catch(err){
        res.json(err)
    }
});

router.patch('/:id', async function(req, res){
    try{
        const query = await LeaveApplication.findOneAndUpdate({ApplicationNumber:req.params.id}, req.body, {new:true}) ;
        res.json(query)
    }
    catch(err){
        res.json(err)
    }
});

module.exports = router