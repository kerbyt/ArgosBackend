const express = require('express');
const router = express.Router();
const constants = require('../config/constants');
const jwt = require('jsonwebtoken');
const Project = require('../models/project');
const authentication = require('../middlewares/authentication');

router.get('/', authentication.verifyToken, (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Project.find()
        //.populate('supervisor1')
        //.populate('supervisor2')
        .skip(pagination)
        .limit(constants.PAGINATION)
        .exec(
            (err, projects) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las obras',
                        errors: err
                    });
                } else {

                    Project.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            projects: projects,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/recordActive/:recordActive', authentication.verifyToken, (req, res, next) => {

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);
    let recordActive = req.params.recordActive;
    recordActive = Boolean(recordActive);

    Project.find({ 'recordActive': recordActive })
        //.populate('supervisor1')
        //.populate('supervisor2')
        .skip(pagination)
        .limit(constants.PAGINATION)
        .exec(
            (err, projects) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar las obras',
                        errors: err
                    });
                } else {

                    Project.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            projects: projects,
                            totalRecords: totalRecords,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/search/:term', authentication.verifyToken, (req, res, next) => {

    let term = req.params.term;
    var regex = new RegExp(term, 'i');

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);

    Project.find()
        //.populate('supervisor1')
        //.populate('supervisor2')
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(constants.PAGINATION)
        .exec(
            (err, projects) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se encontraron resultados',
                        errors: err
                    });
                } else {

                    Project.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            projects: projects,
                            totalRecords: projects.length,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});

router.get('/search/:term/:recordActive', authentication.verifyToken, (req, res, next) => {

    let term = req.params.term;
    var regex = new RegExp(term, 'i');

    let pagination = req.query.pagination || 0;
    pagination = Number(pagination);
    let recordActive = req.params.recordActive;
    recordActive = Boolean(recordActive);

    Project.find({ 'recordActive': recordActive })
        //.populate('supervisor1')
        //.populate('supervisor2')
        .or([{ 'name': regex }]) //arreglo de campos a tomar en cuenta para la busqueda
        .skip(pagination)
        .limit(constants.PAGINATION)
        .exec(
            (err, projects) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se encontraron resultados',
                        errors: err
                    });
                } else {

                    Project.count({}, (err, totalRecords) => {
                        res.status(200).write(JSON.stringify({
                            success: true,
                            projects: projects,
                            totalRecords: projects.length,
                            pagination: pagination
                        }, null, 2));
                        res.end();

                    });
                }
            });
});


router.get('/:id', authentication.verifyToken, (req, res, next) => {

    let id = req.params.id;


    Project.find({ '_id': id })
        //.populate('supervisor1')
        //.populate('supervisor2')
        .exec(
            (err, projects) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'No se pueden consultar la obra',
                        errors: err
                    });
                }

                if (!projects) {
                    return res.status(400).json({
                        success: false,
                        message: 'No existe una obra con el id: ' + id,
                        errors: { message: 'No se pudo encontrar la obra para actualizar' }
                    });
                } else {

                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        projects: projects
                    });

                }
            });
});

router.post('/', authentication.verifyToken, (req, res, next) => {

    let project = new Project({
        name: req.body.name,
        adress: req.body.adress,
        builder: req.body.builder,
        supervisor1: req.body.supervisor1,
        supervisor2: req.body.supervisor2,
        status: req.body.status,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        estimatedDate: req.body.estimatedDate
    });
    project.save((err, project) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'No se puede crear la obra',
                errors: err
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Operación realizada de forma exitosa.',
                project: project
            });
        }
    });
});

router.put('/:id', authentication.verifyToken, (req, res, next) => {

    let id = req.params.id;

    Project.findById(id, (err, project) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'No se puede actualizar la obra',
                errors: err
            });
        }

        if (!project) {
            return res.status(400).json({
                success: false,
                message: 'No existe una obra con el id: ' + id,
                errors: { message: 'No se pudo encontrar la obra para actualizar' }
            });
        } else {

            project.name = req.body.name;
            project.adress = req.body.adress;
            project.builder = req.body.builder;
            project.supervisor1 = req.body.supervisor1;
            project.supervisor2 = req.body.supervisor2;
            project.status = req.body.status;
            project.startDate = req.body.startDate;
            project.endDate = req.body.endDate;
            project.estimatedDate = req.body.estimatedDate;
            project.recordActive = req.body.recordActive || true;

            project.save((err, project) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede actualizar la obra',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        project: project
                    });
                }
            });

        }
    })
});


router.delete('/:id', authentication.verifyToken, (req, res, next) => {

    let id = req.params.id;

    Project.findById(id, (err, project) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'No se puede eliminar la obra',
                errors: err
            });
        }

        if (!project) {
            return res.status(400).json({
                success: false,
                message: 'No existe una obra con el id: ' + id,
                errors: { message: 'No se pudo encontrar la obra para eliminar' }
            });
        } else {

            project.name = req.body.name;
            project.adress = req.body.adress;
            project.builder = req.body.builder;
            project.supervisor1 = req.body.supervisor1;
            project.supervisor2 = req.body.supervisor2;
            project.status = req.body.status;
            project.startDate = req.body.startDate;
            project.endDate = req.body.endDate;
            project.estimatedDate = req.body.estimatedDate;
            project.recordActive = false;

            project.save((err, project) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: 'No se puede eliminar la obra',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Operación realizada de forma exitosa.',
                        project: project
                    });
                }
            });

        }
    })
});

module.exports = router;