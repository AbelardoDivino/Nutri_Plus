const nodemailer = require('nodemailer');

function criarTransporte() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function montarHtmlDieta({ nome, dieta, basal }) {
  const cafe = dieta.cafe || '—';
  const almoco = dieta.almoco || '—';
  const janta = dieta.janta || '—';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Segoe UI,Arial,sans-serif;background:#f5f5f5;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
    <h2 style="color:#00C853;text-align:center">Nutri+ — Seu plano alimentar</h2>
    <p style="text-align:center;color:#666">Olá, <strong>${nome}</strong>! Sua dieta foi publicada.</p>
    ${basal ? `<p style="text-align:center;color:#888;font-size:14px">Referência basal: ${basal.tmb} kcal/dia</p>` : ''}
    <hr style="border:none;border-top:2px solid #69F0AE;margin:20px 0">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:12px;background:#E8F5E9;border-radius:8px;vertical-align:top">
          <h3 style="margin:0 0 8px;color:#1B5E20">☕ Café da manhã</h3>
          <p style="margin:0;color:#333;white-space:pre-wrap">${cafe}</p>
          <small style="color:#FF6D00">${dieta.cafe_calorias || 0} kcal</small>
        </td>
      </tr>
      <tr><td style="height:12px"></td></tr>
      <tr>
        <td style="padding:12px;background:#E8F5E9;border-radius:8px;vertical-align:top">
          <h3 style="margin:0 0 8px;color:#1B5E20">🍽️ Almoço</h3>
          <p style="margin:0;color:#333;white-space:pre-wrap">${almoco}</p>
          <small style="color:#FF6D00">${dieta.almoco_calorias || 0} kcal</small>
        </td>
      </tr>
      <tr><td style="height:12px"></td></tr>
      <tr>
        <td style="padding:12px;background:#E8F5E9;border-radius:8px;vertical-align:top">
          <h3 style="margin:0 0 8px;color:#1B5E20">🌙 Jantar</h3>
          <p style="margin:0;color:#333;white-space:pre-wrap">${janta}</p>
          <small style="color:#FF6D00">${dieta.janta_calorias || 0} kcal</small>
        </td>
      </tr>
    </table>
    <hr style="border:none;border-top:2px solid #69F0AE;margin:20px 0">
    <p style="text-align:center;color:#999;font-size:13px">Nutri+ — App de nutrição</p>
  </div>
</body>
</html>`;
}

async function enviarDietaPorEmail({ para, nome, dieta, basal }) {
  if (!para || !para.includes('@')) {
    return { enviado: false, erro: 'Email do usuário inválido' };
  }

  const transporter = criarTransporte();
  const html = montarHtmlDieta({ nome, dieta, basal });

  try {
    await transporter.sendMail({
      from: `"Nutri+" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: para,
      subject: `Nutri+ — ${nome}, sua dieta foi publicada!`,
      html,
    });
    return { enviado: true };
  } catch (err) {
    return { enviado: false, erro: err.message };
  }
}

module.exports = { enviarDietaPorEmail };
