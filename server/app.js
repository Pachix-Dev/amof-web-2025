// import routes
import express from "express";
import "dotenv/config";
import cors from "cors";
import pkg from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { RegisterModel } from "./db.js";
import { generatePDFInvoice, generatePDF_freePass } from "./generatePdf.js";
import { email_template_amof } from "./TemplateEmailAmof.js";
import { email_template_amof_eng } from "./TemplateEmailAmofEng.js";
import { email_template_summit } from "./TemplateEmailAmofSummit.js";
import { Resend } from "resend";

// const
const app = express();
const { json } = pkg;
// variables de entorno
const PORT = process.env.PORT || 3010;
const environment = process.env.ENVIRONMENT || "sandbox";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const endpoint_url =
  environment === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
const resend = new Resend(process.env.RESEND_APIKEY);

// middlewares
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS.split(",");

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Endpoints
app.post("/free-register", async (req, res) => {
  const { body } = req;

  try {
    const data = {
      uuid: uuidv4(),
      ...body,
    };
    const userResponse = await RegisterModel.create_user({ ...data });

    if (!userResponse.status) {
      return res.status(500).send({
        ...userResponse,
      });
    }

    return res.send({
      ...userResponse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: false,
      message:
        "Hubo un error con el registro, por favor intentalo más tarde...",
    });
  }
});
app.post("/free-register-summit", async (req, res) => {
  const { body } = req;

  try {
    const data = {
      uuid: uuidv4(),
      ...body,
    };
    const userResponse = await RegisterModel.create_user_summit({ ...data });

    if (!userResponse.status) {
      return res.status(500).send({
        ...userResponse,
      });
    }

    return res.send({
      ...userResponse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      status: false,
      message:
        "Hubo un error con el registro, por favor intentalo más tarde...",
    });
  }
});
app.post("/create-order", async (req, res) => {
  const { body } = req;

  const BASE_PRICE = 300;
  let expectedTotal = BASE_PRICE;

  // Buscar si hay un descuento en items
  const discountItem = body.items?.filter((item) => item?.isDiscount);
  console.log(discountItem);

  if (discountItem.length === 1) {
    // Buscar el código en la base de datos
    const codeData = await RegisterModel.check_code_cortesia(
      discountItem[0].name
    );
    if (!codeData.status) {
      return res.status(400).send({
        status: false,
        message: "El código de descuento no es válido.",
      });
    }

    // Calcular el descuento
    const discount = BASE_PRICE * (codeData.result.discount_percent / 100);
    expectedTotal = BASE_PRICE - discount;

    // Validar que el total recibido sea igual al esperado
    if (body.total !== expectedTotal) {
      return res.status(400).send({
        status: false,
        message: "El total enviado no coincide con el descuento aplicado.",
      });
    }
  } else {
    // Si no hay descuento, validar que el total sea igual al precio base
    if (body.total !== BASE_PRICE) {
      return res.status(400).send({
        status: false,
        message:
          "Tu compra no pudo ser procesada, la información no es valida...",
      });
    }
  }

  get_access_token()
    .then(async (access_token) => {
      let order_data_json = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "MXN",
              value: body.total,
            },
            description: "ACCESO AMOF 2025",
          },
        ],
      };
      const data = JSON.stringify(order_data_json);

      fetch(endpoint_url + "/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          res.send(json);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post("/create-order-summit", async (req, res) => {
  const { body } = req;

  const BASE_PRICE = 300;
  let expectedTotal = BASE_PRICE;

  // Buscar si hay un descuento en items
  const discountItem = body.items?.filter((item) => item?.isDiscount);
  console.log(discountItem);

  if (discountItem.length === 1) {
    // Buscar el código en la base de datos
    const codeData = await RegisterModel.check_code_cortesia_summit(
      discountItem[0].name
    );
    if (!codeData.status) {
      return res.status(400).send({
        status: false,
        message: "El código de descuento no es válido.",
      });
    }

    // Calcular el descuento
    const discount = BASE_PRICE * (codeData.result.discount_percent / 100);
    expectedTotal = BASE_PRICE - discount;

    // Validar que el total recibido sea igual al esperado
    if (body.total !== expectedTotal) {
      return res.status(400).send({
        status: false,
        message: "El total enviado no coincide con el descuento aplicado.",
      });
    }
  } else {
    // Si no hay descuento, validar que el total sea igual al precio base
    if (body.total !== BASE_PRICE) {
      return res.status(400).send({
        status: false,
        message:
          "Tu compra no pudo ser procesada, la información no es valida...",
      });
    }
  }

  get_access_token()
    .then(async (access_token) => {
      let order_data_json = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "MXN",
              value: body.total,
            },
            description: "ACCESO AMOF SUMMIT 2025",
          },
        ],
      };
      const data = JSON.stringify(order_data_json);

      fetch(endpoint_url + "/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          res.send(json);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post("/complete-order", async (req, res) => {
  const { body } = req;
  try {
    const userResponse = await RegisterModel.get_user_by_id(body.user_id);
    console.log(userResponse);
    if (!userResponse.status) {
      return res.status(404).send({
        message: userResponse.error,
      });
    }

    const access_token = await get_access_token();
    const response = await fetch(
      endpoint_url + "/v2/checkout/orders/" + req.body.orderID + "/capture",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // buscar el id del cupon de descuento si existe
    const discountItem = body.items?.find((item) => item?.isDiscount);
    const id_code = discountItem ? discountItem.id : null;

    const json = await response.json();
    console.log(JSON.stringify(json));
    if (json.id) {
      if (
        json.purchase_units[0].payments.captures[0].status === "COMPLETED" ||
        json.purchase_units[0].payments.captures[0].status === "PENDING"
      ) {
        const paypal_id_order = json.id;
        const paypal_id_transaction =
          json.purchase_units[0].payments.captures[0].id;
        await RegisterModel.save_order(
          body.user_id,
          paypal_id_order,
          paypal_id_transaction,
          id_code
        );
        const pdfAtch = await generatePDFInvoice(
          paypal_id_transaction,
          body,
          userResponse.user.uuid
        );
        const mailResponse = await sendEmail(
          body,
          pdfAtch,
          paypal_id_transaction
        );

        return res.send({
          ...mailResponse,
          invoice: `${paypal_id_transaction}.pdf`,
        });
      }
    } else {
      return res.status(500).send({
        status: false,
        message:
          "Tu compra no pudo ser procesada, hay un problema con tu metodo de pago por favor intenta mas tarde...",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message:
        "hubo un error al procesar tu compra, por favor intenta mas tarde...",
    });
  }
});

app.post("/complete-order-summit", async (req, res) => {
  const { body } = req;
  try {
    const userResponse = await RegisterModel.get_user_by_id_summit(
      body.user_id
    );
    console.log(userResponse);
    if (!userResponse.status) {
      return res.status(404).send({
        message: userResponse.error,
      });
    }

    const access_token = await get_access_token();
    const response = await fetch(
      endpoint_url + "/v2/checkout/orders/" + req.body.orderID + "/capture",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // buscar el id del cupon de descuento si existe
    const discountItem = body.items?.find((item) => item?.isDiscount);
    const id_code = discountItem ? discountItem.id : null;

    const json = await response.json();
    console.log(JSON.stringify(json));
    if (json.id) {
      if (
        json.purchase_units[0].payments.captures[0].status === "COMPLETED" ||
        json.purchase_units[0].payments.captures[0].status === "PENDING"
      ) {
        const paypal_id_order = json.id;
        const paypal_id_transaction =
          json.purchase_units[0].payments.captures[0].id;
        await RegisterModel.save_order_summit(
          body.user_id,
          paypal_id_order,
          paypal_id_transaction,
          id_code
        );
        const pdfAtch = await generatePDFInvoice(
          paypal_id_transaction,
          body,
          userResponse.user.uuid
        );
        const mailResponse = await sendEmailSummit(
          body,
          pdfAtch,
          paypal_id_transaction
        );

        return res.send({
          ...mailResponse,
          invoice: `${paypal_id_transaction}.pdf`,
        });
      }
    } else {
      return res.status(500).send({
        status: false,
        message:
          "Tu compra no pudo ser procesada, hay un problema con tu metodo de pago por favor intenta mas tarde...",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: false,
      message:
        "hubo un error al procesar tu compra, por favor intenta mas tarde...",
    });
  }
});

// este endponit es pera el proceso de compra
app.get("/get-user-by-email", async (req, res) => {
  const { email } = req.query;
  const user = await RegisterModel.get_user_by_email(email);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).send({ message: "No se encontró el usuario" });
  }
});

// este endponit es pera el proceso de compra en el summit
app.get("/get-user-by-email-summit", async (req, res) => {
  const { email } = req.query;
  const user = await RegisterModel.get_user_by_email_summit(email);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).send({ message: "No se encontró el usuario" });
  }
});

// este endponit es pera el proceso ver el directorio digital 2025
app.get("/verify-user-register", async (req, res) => {
  const { email } = req.query;
  const user = await RegisterModel.verify_user_register(email);
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).send({ message: "No se encontró el usuario" });
  }
});

app.post("/check-cortesia", async (req, res) => {
  const { body } = req;

  const response = await RegisterModel.check_code_cortesia(body.code_cortesia);

  if (response.status) {
    if (response.result.discount_percent === 100) {
      const userResponse = await RegisterModel.get_user_by_id(body.user_id);

      if (!userResponse.status) {
        return res.status(404).send({
          message: userResponse.error,
        });
      }

      await RegisterModel.save_order(
        body.user_id,
        response.result.code,
        response.result.code,
        response.result.id
      );

      const pdfAtch = await generatePDF_freePass(body, userResponse.user.uuid);

      const mailResponse = await sendEmail(
        body,
        pdfAtch,
        userResponse.user.uuid
      );

      return res.send({
        ...mailResponse,
        invoice: `${userResponse.user.uuid}.pdf`,
        next: true,
      });
    }

    return res.send({
      status: true,
      result: response.result,
    });
  } else {
    res.status(400).send({
      message: response.message,
    });
  }
});

// check code cortesia summit
app.post("/check-cortesia-summit", async (req, res) => {
  const { body } = req;

  const response = await RegisterModel.check_code_cortesia_summit(
    body.code_cortesia
  );

  if (response.status) {
    if (response.result.discount_percent === 100) {
      const userResponse = await RegisterModel.get_user_by_id_summit(
        body.user_id
      );

      if (!userResponse.status) {
        return res.status(404).send({
          message: userResponse.error,
        });
      }

      await RegisterModel.save_order_summit(
        body.user_id,
        response.result.code,
        response.result.code,
        response.result.id
      );

      const pdfAtch = await generatePDF_freePass(body, userResponse.user.uuid);

      const mailResponse = await sendEmailSummit(
        body,
        pdfAtch,
        userResponse.user.uuid
      );

      return res.send({
        ...mailResponse,
        invoice: `${userResponse.user.uuid}.pdf`,
        next: true,
      });
    }

    return res.send({
      status: true,
      result: response.result,
    });
  } else {
    res.status(400).send({
      message: response.message,
    });
  }
});

function get_access_token() {
  const auth = `${client_id}:${client_secret}`;
  const data = "grant_type=client_credentials";
  return fetch(endpoint_url + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(auth).toString("base64")}`,
    },
    body: data,
  })
    .then((res) => res.json())
    .then((json) => {
      return json.access_token;
    });
}

async function sendEmail(data, pdfAtch = null, paypal_id_transaction = null) {
  try {
    const emailContent =
      data.currentLanguage === "es"
        ? await email_template_amof({ ...data })
        : await email_template_amof_eng({ ...data });
    await resend.emails.send({
      from: "AMOF 2025 <noreply@igeco.mx>",
      to: data.email,
      subject: "Confirmación de pre registro AMOF 2025",
      html: emailContent,
      attachments: [
        {
          filename: `${paypal_id_transaction}.pdf`,
          path: `https://amofexpo.igeco.mx/invoices/${paypal_id_transaction}.pdf`,
          content_type: "application/pdf",
        },
      ],
    });

    return {
      status: true,
      message:
        "Gracias por registrarte, te hemos enviado un correo de confirmación a tu bandeja de entrada...",
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message:
        "No pudimos enviarte el correo de confirmación de tu registro, por favor descarga tu registro en este pagina y presentalo hasta el dia del evento...",
    };
  }
}

async function sendEmailSummit(
  data,
  pdfAtch = null,
  paypal_id_transaction = null
) {
  try {
    const emailContent =
      data.currentLanguage === "es"
        ? await email_template_summit({ ...data })
        : await email_template_amof_eng({ ...data });
    await resend.emails.send({
      from: "Summit AMOF 2025 <noreply@igeco.mx>",
      to: data.email,
      subject: "Confirmación de pre registro AMOF Summit 2025",
      html: emailContent,
      // attachments: [
      //   {
      //     filename: `${paypal_id_transaction}.pdf`,
      //     path: `https://amofexpo.igeco.mx/invoices/${paypal_id_transaction}.pdf`,
      //     content_type: "application/pdf",
      //   },
      // ],
    });

    return {
      status: true,
      message:
        "Gracias por registrarte, te hemos enviado un correo de confirmación a tu bandeja de entrada...",
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message:
        "No pudimos enviarte el correo de confirmación de tu registro, por favor descarga tu registro en este pagina y presentalo hasta el dia del evento...",
    };
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
