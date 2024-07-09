const Form = require("../models/Form");
const Question = require("../models/Question");
const Response = require("../models/Response");

exports.newForm = async (req, res) => {
  const { title, description, startDate, endDate, headerColor, questionBorderColor, backgroundColor, questions } = req.body;

  try {
    const form = await Form.create({
      title,
      description,
      startDate,
      endDate,
      headerColor,
      questionBorderColor,
      backgroundColor
    });

    if (questions && questions.length > 0) {
      const questionPromises = questions.map(q => Question.create({ ...q, formId: form.id }));
      await Promise.all(questionPromises);
    }

    const publicLink = `http://localhost:3000/form/${form.id}`;
    form.publicLink = publicLink;

    await form.save();

    res.status(201).json({ form, publicLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFormWithQuestions = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await Form.findByPk(id, {
      include: [{ model: Question }], // Incluir las preguntas asociadas al formulario
    });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.submitResponse = async (req, res) => {
  const { formId, responses } = req.body;

  try {
    const responsePromises = responses.map(r => Response.create({ ...r, formId }));
    await Promise.all(responsePromises);

    res.status(201).json({ message: 'Responses submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};