import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./src/utils/creds.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets("v4");
const SPREADSHEET_ID = "1jnhRBS6zf3GzuiDIe8t7XTI0sfLkoU8BztCncX-avZA";

export async function getClients() {
  try {
    const avancesDeObra = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Clientes!A2:C",
    });
    return avancesDeObra.data.values;
  } catch (err) {
    console.log(err);
  }
}

export async function getMailsAvances() {
  try {
    const mails = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Reportes Avances!A2:A",
    });
    return mails.data.values.map((mail) => mail[0]);
  } catch (err) {
    console.log(err);
  }
}
export async function getMailsControl() {
  try {
    const mails = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Reportes Control!A2:A",
    });
    return mails.data.values.map((mail) => mail[0]);
  } catch (err) {
    console.log(err);
  }
}

export async function getAvancesObra() {
  try {
    const avancesDeObra = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Avance de obra!A2:H",
    });
    return avancesDeObra.data.values;
  } catch (err) {
    console.log(err);
  }
}

export async function getControlCalidad() {
  try {
    const controlCalidad = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SPREADSHEET_ID,
      range: "Control de calidad!A2:I",
    });
    return controlCalidad.data.values;
  } catch (err) {
    console.log(err);
  }
}
