const express = require('express');
const router = express.Router();
const constants = require('../config/constants');
const jwt = require('jsonwebtoken');
const DepartmentSubTask = require('../models/departmentSubTask');
const authentication = require('../middlewares/authentication');

router.get('/', authentication.verifyToken, (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    DepartmentSubTask.find()
        .populate('department')
        .populate('task')
        .populate('subTask')
        .populate('floor')
        .populate('project')
        .skip(pagination)
        .limit(constants.PAGINATION)
        .exec(
            (err, departmentSubTasks) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar la información',
                        errors: err
                    });
                } else {
                    DepartmentSubTask.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            departmentSubTasks: departmentSubTasks,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/task/:idProject/:idTask', authentication.verifyToken, (req, res, next) => {

    let idProject = req.params.idProject;
    let idTask = req.params.idTask;

    DepartmentSubTask.find({ 'project': idProject, 'task': idTask })
        .populate('department')
        .populate('task')
        .populate('subTask')
        .populate('floor')
        .populate('project')
        .exec(
            (err, departmentSubTasks) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar la información',
                        errors: err
                    });
                } else {
                    DepartmentSubTask.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            departmentSubTasks: departmentSubTasks,
                            totalRecords: totalRecords
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/department/:idProject/:idDepartment', authentication.verifyToken, (req, res, next) => {

    let idProject = req.params.idProject;
    let idDepartment = req.params.idDepartment;

    DepartmentSubTask.find({ 'project': idProject, 'department': idDepartment })
        .populate('department')
        .populate('task')
        .populate('subTask')
        .populate('floor')
        .populate('project')
        .exec(
            (err, departmentSubTasks) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar la información',
                        errors: err
                    });
                } else {
                    DepartmentSubTask.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            departmentSubTasks: departmentSubTasks,
                            totalRecords: totalRecords
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/floor/:idProject/:idFloor', authentication.verifyToken, (req, res, next) => {

    let idProject = req.params.idProject;
    let idFloor = req.params.idFloor;

    DepartmentSubTask.find({ 'project': idProject, 'floor': idFloor })
        .populate('department')
        .populate('task')
        .populate('subTask')
        .populate('floor')
        .populate('project')
        .exec(
            (err, departmentSubTasks) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar la información',
                        errors: err
                    });
                } else {
                    DepartmentSubTask.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            departmentSubTasks: departmentSubTasks,
                            totalRecords: totalRecords
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.post('/', authentication.verifyToken, (req, res, next) => {
    let departmentSubTask = new DepartmentSubTask({
        department: req.body.department,
        task: req.body.task,
        subTask: req.body.subTask,
        floor: req.body.floor,
        project: req.body.project,
        startDate: req.body.startDate,
        updateDate: req.body.updateDate,
        endDate: req.body.endDate,
        status: req.body.status
    });
    departmentSubTask.save((err, departmentSubTask) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'No se puede guardar el registro',
                errors: err
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                departmentSubTask: departmentSubTask
            });
        }
    });
});

router.put('/:id', authentication.verifyToken, (req, res, next) => {

    let id = req.params.id;

    DepartmentSubTask.findById(id, (err, departmentSubTask) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'No se puede actualizar el registro',
                errors: err
            });
        }

        if (!departmentSubTask) {
            return res.status(400).json({
                success: false,
                message: 'No existe un registro con el id: ' + id,
                errors: { message: 'No se pudo encontrar el registro para actualizar' }
            });
        } else {

            departmentSubTask.department = req.body.department;
            departmentSubTask.task = req.body.task;
            departmentSubTask.subTask = req.body.subTask;
            departmentSubTask.floor = req.body.floor;
            departmentSubTask.project = req.body.project;
            departmentSubTask.startDate = req.body.startDate;
            departmentSubTask.updateDate = req.body.updateDate;
            departmentSubTask.endDate = req.body.endDate;
            departmentSubTask.status = req.body.status;

            departmentSubTask.save((err, departmentSubTask) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar el registro',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        departmentSubTask: departmentSubTask
                    });
                }
            });

        }
    })
});


router.delete('/:id', authentication.verifyToken, (req, res, next) => {

    let id = req.params.id;

    DepartmentSubTask.findByIdAndRemove(id, (err, departmentSubTask) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'No se puede eliminar el registro',
                errors: err
            });
        } else if (departmentSubTask) {
            res.status(200).json({
                success: true,
                message: 'Operación realizada de forma exitosa',
                departmentSubTask: departmentSubTask
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'No existe un registro con el id: ' + id,
                errors: { message: 'No se pudo encontrar el registro para eliminar' }
            });
        }
    })
});

module.exports = router;