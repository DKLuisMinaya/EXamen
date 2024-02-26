import { TypeUsersModel } from "../models/TypeUsersModel.js";

export const getTypeUsers = async (req, res) => {
  try {
    const users = await TypeUsersModel.findAll({
    },{where: {state:true}});
  
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTypeUsers = async (req, res) => {
  try {
    const { lugar, cine } = req.body;

    const nuevoCine = await TypeUsersModel.create({
      lugar,
      cine,
      state: true, // Puedes ajustar esto según tus necesidades
    });

    // Devuelve la respuesta con el nuevo registro de cine creado
    return res.status(201).json({
      success: true,
      message: 'Cine registrado exitosamente',
      data: nuevoCine,
    });
  } catch (error) {
    console.error('Error al registrar el cine:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  };
}













export const updateTypeUsers = async (req, res) => {
  if (!req.body.type) {
    res.status(400).json({ message: "type is required" });
  }
  const type = await TypeUsersModel.findOne({ where: { id: req.params.id } });
  if (type) {
    type.set(req.body);
    await type.save();
    res.status(200).json({ message: "update" });
  } else {
    res.status(404).json({ message: "type not found" });
  }
};
export const deleteTypeUsers = async (req, res) => {
  const type = await TypeUsersModel.findOne({ where: { id: req.params.id } });
  if (type) {
    type.set({ ...type, state: false });
    await type.save();
    res.status(200).json({ message: "delete" });
  } else {
    res.status(404).json({ message: "type not found" });
  }
};
