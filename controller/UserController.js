import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { TOKEN_KEY } from "../config/config.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: ['habitaciones', 'capacidad', 'pelicula']
    },{where: {state:true}});
  
    res.status(200).json({users});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({where:{id:req.params.id}});
    if(!user){
      res.status(404).json({message: "user not found"});
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const createUsers = async (req, res) => {
  try {
    
    const { habitaciones, numeroHabitacion, capacidad, pelicula, typeusers_id} = req.body;

    const nuevaHabitacion = await UserModel.create({
      habitaciones,
      numeroHabitacion,
      capacidad,
      pelicula,
      typeusers_id,
      state: true, // Puedes ajustar esto según tus necesidades
    });

    // Devuelve la respuesta con el nuevo registro de habitación creado
    return res.status(201).json({
      success: true,
      message: 'Habitación registrada exitosamente',
      data: nuevaHabitacion,
    });
  } catch (error) {
    console.error('Error al registrar la habitación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }

  
};

export const reservar = async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { numeroHabitacion, asientosReservados } = req.body;

    // Busca la habitación por su número de habitación
    const habitacion = await UserModel.findOne({
      where: { numeroHabitacion },
    });

    if (!habitacion) {
      return res.status(404).json({
        success: false,
        message: 'La habitación no existe',
      });
    }

    // Verifica si hay suficientes asientos disponibles
    if (habitacion.capacidad < asientosReservados) {
      return res.status(400).json({
        success: false,
        message: 'No hay suficientes asientos disponibles',
      });
    }

    // Verifica que no se reserven más asientos de los disponibles
    if (asientosReservados <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad de asientos reservados debe ser mayor que cero',
      });
    }

    // Verifica que no se reserven más asientos de los disponibles
    if (asientosReservados > habitacion.capacidad) {
      return res.status(400).json({
        success: false,
        message: 'No se pueden reservar más asientos de los disponibles',
      });
    }

    // Actualiza el número de capacidad restando los asientos reservados
    habitacion.capacidad -= asientosReservados;
    await habitacion.save();

    // Puedes realizar otras operaciones relacionadas con la reserva aquí si es necesario

    // Devuelve la respuesta con la habitación actualizada
    return res.status(200).json({
      success: true,
      message: 'Asientos reservados exitosamente',
      data: habitacion,
    });
  } catch (error) {
    console.error('Error al reservar asientos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
};

export const mostrar = async (req, res) => {
  
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { numeroHabitacion } = req.body;

    // Busca la habitación por su número de habitación
    const habitacion = await UserModel.findOne({
      where: { numeroHabitacion },
    });

    if (!habitacion) {
      return res.status(404).json({
        success: false,
        message: 'La habitación no existe',
      });
    }

    // Devuelve la respuesta con el número de habitación y la cantidad de asientos disponibles
    return res.status(200).json({
      success: true,
      message: 'Información de disponibilidad obtenida exitosamente',
      data: {
        numeroHabitacion: habitacion.numeroHabitacion,
        asientosDisponibles: habitacion.capacidad,
      },
    });
  } catch (error) {
    console.error('Error al obtener la disponibilidad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  
};
}










export const updateUsers = async (req, res) => {
  const { user } = req.body;
  if (!(user)) {
    res.status(400).json({ message: "user is required" });
  }
  const userD = await UserModel.findOne({where:{id:req.params.id}});
  if(userD){
    userD.set({...userD,user:user});
      await userD.save();
      res.status(200).json({ message: "update" });
  }else{
      res.status(404).json({message: "user not found"});
  }
};
export const updateUsersEmail = async (req, res) => {
  const { email } = req.body;
  if (!(email)) {
    res.status(400).json({ message: "email is required" });
  }
  const oldUser = await UserModel.findOne({ where: { email: email } });
  if (oldUser) {
    return res.status(409).json("email already exist");
  }
  const userD = await UserModel.findOne({where:{id:req.params.id}});
  if(userD){
    userD.set({...userD,email:email});
      await userD.save();
      res.status(200).json({ message: "update" });
  }else{
      res.status(404).json({message: "user not found"});
  }
};
export const updateUsersPassword = async (req, res) => {
  const { password } = req.body;
  if (!(password)) {
    res.status(400).json({ message: "password is required" });
  }
  const userD = await UserModel.findOne({where:{id:req.params.id}});
  if(userD){
    userD.set({...userD,password:password});
      await userD.save();
      res.status(200).json({ message: "update" });
  }else{
      res.status(404).json({message: "user not found"});
  }
};
export const deleteUsers = async (req, res) => {
  const user = await UserModel.findOne({ where: { id: req.params.id } });
  if (user) {
    user.set({ ...user, state: false });
    await user.save();
    res.status(200).json({ message: "delete" });
  } else {
    res.status(404).json({ message: "type not found" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({message:"All input is required"});
    }
    const user = await UserModel.findOne({
      where: { email: email.toLowerCase() },
    });
     // Check if user exists
     if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   // If everything is valid, generate a token
    const token = jwt.sign({ user_id: user.id, email }, TOKEN_KEY, {
      expiresIn: "1h",
    });
      let dataUser={
          id:user.id,
          user:user.user,
          email:user.email,
          typeusers_id:user.typeusers_id
      }
      res.status(200).json({ dataUser, token: token });
  } catch (err) {
    console.error("Login:", err.message );
    res.status(500).json({ error: err.message });
  }
};
export const logout = async (req, res)=>{

}
export const refresh = (req, res) => {
  const token = req.headers["authorization"].split(" ")[1];
	if (!token) {
		return res.status(401).end()
	}
	var payload
	try {
		payload = jwt.verify(token, 'secret')
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).end()
		}
		return res.status(400).end()
	}
	const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
	if (payload.exp - nowUnixSeconds > 30) {
		return res.status(400).end()
	}
	const newToken = jwt.sign({ username: payload.username }, jwtKey, {
		algorithm: "HS256",
		expiresIn: jwtExpirySeconds,
	})
	res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 })
	res.end()
}
