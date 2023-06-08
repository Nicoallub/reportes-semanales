import {
  getAvancesObra,
  getClients,
  getControlCalidad,
  getMailsAvances,
  getMailsControl,
} from "../../utils/get_sheets";
import sendMail from "../../utils/nodemailer";

export default async function handler(req, res) {
  // sendMail().then(() => {
  //   console.log("Mail sent");
  // });
  let clients = await getClients();
  let avancesObra = await getAvancesObra();
  let controlesCalidad = await getControlCalidad();

  let lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);

  let lotesWithData = [];

  clients.forEach((client) => {
    let lotes = client[2].split(",");

    for (let i = 0; i < lotes.length; i++) {
      let avances = avancesObra.filter((avance) => {
        if (!avance[7]) return false;
        let dateValues = avance[7].split("/");
        let avanceDate = new Date(
          dateValues[2],
          dateValues[1] - 1,
          dateValues[0]
        );
        return lotes.includes(avance[1]) && avanceDate > lastWeekDate;
      });

      let controles = controlesCalidad.filter((control) => {
        if (!control[5]) return false;
        let dateValues = control[5].split("/");
        let controlDate = new Date(
          dateValues[2],
          dateValues[1] - 1,
          dateValues[0]
        );

        return lotes.includes(control[1]) && controlDate > lastWeekDate;
      });

      if (avances.length > 0 || controles.length > 0) {
        let loteData = {
          id: lotes[i],
          client: {
            name: client[1],
            id: client[0],
          },
          avances,
          controles,
        };
        lotesWithData.push(loteData);
      }
    }
  });

  let lotesWithAvances = lotesWithData.filter(
    (lote) => lote.avances.length > 0
  );
  let lotesWithControles = lotesWithData.filter(
    (lote) => lote.controles.length > 0
  );

  let avancesHTMLContent = lotesWithAvances.map((lote) => {
    let avancesHTML = lote.avances.map((avance) => {
      let porcentajeAvance = 0;
      if (parseFloat(avance[4]) !== 0) {
        porcentajeAvance =
          (parseFloat(avance[5].replace(",", ".")) * 100) /
          parseFloat(avance[4]);
      }
      return `<li><b>${avance[3]}</b> (${
        avance[7]
      }): ${porcentajeAvance.toFixed(2)}%</li>`;
    });

    let htmlString = `<li><b>${lote.id}</b> (${
      lote.client.name
    }):<ul>${avancesHTML.join("")}</ul></li>`;
    return htmlString;
  });

  let controlesHTMLContent = lotesWithControles.map((lote) => {
    let controlesHTML = lote.controles.map((control) => {
      console.log(control);
      return `<li>${control[3]} <b>${control[8].toUpperCase()}</b> (${
        control[5]
      }) ${control[6] !== "" ? " - " + control[6] : ""}.</li>`;
    });

    let htmlString = `<li><b>${lote.id}</b> (${
      lote.client.name
    }):<ul>${controlesHTML.join("")}</ul></li>`;
    return htmlString;
  });

  const mailsAvances = await getMailsAvances();
  const mailsControl = await getMailsControl();

  // Avances
  sendMail(
    mailsAvances,
    "Reporte semanal - Avances de obra",
    avancesHTMLContent.join("")
  );

  // Control de calidad
  sendMail(
    mailsControl,
    "Reporte semanal - Control de calidad",
    controlesHTMLContent.join("")
  );

  res.status(200).json({
    avancesHTMLContent: avancesHTMLContent.join(""),
    controlesHTMLContent: controlesHTMLContent.join(""),
    lotesWithAvances,
    lotesWithControles,
  });
}
