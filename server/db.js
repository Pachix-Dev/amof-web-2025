import mysql from "mysql2/promise";
import "dotenv/config";

// variables de entorno
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const hableError = (error) => {
  if (error?.sqlState === "23000") {
    return {
      status: false,
      message: "Ya existe un usuario registrado con ese correo electrónico",
    };
  }

  return {
    status: false,
    message: "Error al guardar los datos, intentalo de nuevo",
  };
};

export class RegisterModel {
  // Esta función es para el registro de usuarios en la base de datos
  static async create_user({
    uuid,
    name,
    paternSurname,
    maternSurname,
    email,
    phone,
    typeRegister,
    genre,
    nacionality,
    code_invitation,
    company,
    industry,
    position,
    area,
    country,
    municipality,
    state,
    city,
    address,
    colonia,
    postalCode,
    webPage,
    phoneCompany,
    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO users (uuid, name, paternSurname, maternSurname, email, phone, typeRegister, gender, nacionality, code_invitation, company, industry, position, area, country, municipality, state, city, address, colonia, postalCode, webPage, phoneCompany, eventKnowledge, productInterest, levelInfluence, wannaBeExhibitor, alreadyVisited ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          uuid,
          name,
          paternSurname,
          maternSurname,
          email,
          phone,
          typeRegister,
          genre,
          nacionality,
          code_invitation,
          company,
          industry,
          position,
          area,
          country,
          municipality,
          state,
          city,
          address,
          colonia,
          postalCode,
          webPage,
          phoneCompany,
          eventKnowledge,
          productInterest,
          levelInfluence,
          wannaBeExhibitor,
          alreadyVisited,
        ]
      );

      return {
        status: true,
        uuid,
        insertId: result.insertId,
        ...result,
      };
    } catch (err) {
      console.log(err);
      return hableError(err);
    } finally {
      await connection.end();
    }
  }
  // Esta función es para el registro de usuarios en la base de datos para el summit
  static async create_user_summit({
    uuid,
    name,
    paternSurname,
    maternSurname,
    email,
    phone,
    typeRegister,
    genre,
    nacionality,
    code_invitation,
    company,
    industry,
    position,
    area,
    country,
    municipality,
    state,
    city,
    address,
    colonia,
    postalCode,
    webPage,
    phoneCompany,
    eventKnowledge,
    productInterest,
    levelInfluence,
    wannaBeExhibitor,
    alreadyVisited,
  }) {
    const connection = await mysql.createConnection(config);
    try {
      const [result] = await connection.query(
        "INSERT INTO users_summit(uuid, name, paternSurname, maternSurname, email, phone, typeRegister, genre, nacionality, code_invitation, company, industry, position, area, country, municipality, state, city, address, colonia, postalCode, webPage, phoneCompany, eventKnowledge, productInterest, levelInfluence, wannaBeExhibitor, alreadyVisited ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          uuid,
          name,
          paternSurname,
          maternSurname,
          email,
          phone,
          typeRegister,
          genre,
          nacionality,
          code_invitation,
          company,
          industry,
          position,
          area,
          country,
          municipality,
          state,
          city,
          address,
          colonia,
          postalCode,
          webPage,
          phoneCompany,
          eventKnowledge,
          productInterest,
          levelInfluence,
          wannaBeExhibitor,
          alreadyVisited,
        ]
      );

      return {
        status: true,
        uuid,
        insertId: result.insertId,
        ...result,
      };
    } catch (err) {
      console.log(err);
      return hableError(err);
    } finally {
      await connection.end();
    }
  }
  // Esta función es para obtener un usuario por su ID
  static async get_user_by_id(id) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      return {
        status: true,
        user: users[0],
      };
    } finally {
      await connection.end();
    }
  }
  // Esta función es para obtener un usuario por su ID en el summit
  static async get_user_by_id_summit(id) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_summit WHERE id = ?",
        [id]
      );
      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      return {
        status: true,
        user: users[0],
      };
    } finally {
      await connection.end();
    }
  }

  // esta funcion es para el proceso de compra
  static async get_user_by_email(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      const [vipUsers] = await connection.query(
        "SELECT * FROM users_vip WHERE user_id = ?",
        [users[0].id]
      );

      if (vipUsers.length > 0) {
        return {
          status: false,
          error: "Ya eres usuario VIP",
        };
      }

      return {
        status: true,
        ...users[0],
      };
    } finally {
      await connection.end();
    }
  }
  // esta funcion es para el proceso de compra en el summit
  static async get_user_by_email_summit(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_summit WHERE email = ?",
        [email]
      );
      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      const [vipUsers] = await connection.query(
        "SELECT * FROM users_vip_summit WHERE user_id = ?",
        [users[0].id]
      );

      if (vipUsers.length > 0) {
        return {
          status: false,
          error: "Ya eres usuario VIP",
        };
      }

      return {
        status: true,
        ...users[0],
      };
    } finally {
      await connection.end();
    }
  }
  // esta funcion es para el proceso de ver el directorio digital
  static async verify_user_register(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      return {
        status: true,
        ...users[0],
      };
    } finally {
      await connection.end();
    }
  }
  // esta funcion es para el proceso de ver el directorio digital en el summit
  static async verify_user_register_summit(email) {
    const connection = await mysql.createConnection(config);
    try {
      const [users] = await connection.query(
        "SELECT * FROM users_summit WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return {
          status: false,
          error: "No se encontró el usuario",
        };
      }

      return {
        status: true,
        ...users[0],
      };
    } finally {
      await connection.end();
    }
  }
  // esta funcion es para gurdar el proceso de compra
  static async save_order(user_id, paypal_id_order, paypal_id_transaction, id_code = 0) {
    const connection = await mysql.createConnection(config);
    try {
      const [registers] = await connection.query(
        "INSERT INTO users_vip (user_id, paypal_id_order, paypal_id_transaction, id_code) VALUES (?,?,?,?)",
        [user_id, paypal_id_order, paypal_id_transaction, id_code]
      );
      return registers;
    } finally {
      await connection.end(); // Close the connection
    }
  }
  // esta funcion es para gurdar el proceso de compra en el summit
  static async save_order_summit(user_id, paypal_id_order, paypal_id_transaction, id_code = 0) {
    const connection = await mysql.createConnection(config);
    try {
      const [registers] = await connection.query(
        "INSERT INTO users_vip_summit (user_id, paypal_id_order, paypal_id_transaction, id_code) VALUES (?,?,?,?)",
        [user_id, paypal_id_order, paypal_id_transaction, id_code]
      );
      return registers;
    } finally {
      await connection.end(); // Close the connection
    }
  }

  // check code cortesia
  static async check_code_cortesia(code_cortesia) {
    const connection = await mysql.createConnection(config);
    try {
      // Verifica si el código existe en codigos_cortesia
      const [result] = await connection.query(
        'SELECT * FROM codigos_cortesia WHERE code = ?',
        [code_cortesia]
      );

      if (result.length === 0) {
        return {
          status: false,
          message: "Código invalido",
        };
      }

      // Cuenta cuántas veces se ha usado el código en users_vip
      const [countResult] = await connection.query(
        'SELECT COUNT(*) as count FROM users_vip WHERE id_code = ?',
        [result[0].id]
      );

      if (countResult[0].count >= result[0].max_use) {
        return {
          status: false,
          message: "Código invalido",
        };
      }

      return {
        status: true,
        result: result[0],
      };

    } finally {
      await connection.end(); // Close the connection
    }
  }
  // check code cortesia summit
  static async check_code_cortesia_summit(code_cortesia) {
    const connection = await mysql.createConnection(config);
    try {
      // Verifica si el código existe en codigos_cortesia
      const [result] = await connection.query(
        'SELECT * FROM codigos_cortesia WHERE code = ?',
        [code_cortesia]
      );

      if (result.length === 0) {
        return {
          status: false,
          message: "Código invalido",
        };
      }

      // Cuenta cuántas veces se ha usado el código en users_vip
      const [countResult] = await connection.query(
        'SELECT COUNT(*) as count FROM users_vip_summit WHERE id_code = ?',
        [result[0].id]
      );

      if (countResult[0].count >= result[0].max_use) {
        return {
          status: false,
          message: "Código invalido",
        };
      }

      return {
        status: true,
        result: result[0],
      };

    } finally {
      await connection.end(); // Close the connection
    }
  }
}
