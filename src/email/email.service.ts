import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, firstName: string, verificationCode: string) {
    console.log(`📧 Intentando enviar email a: ${email}`);
    console.log(`🔑 Usando credenciales: ${this.configService.get('EMAIL_USER')}`);
    
    // Solo usar consola si está explícitamente deshabilitado
    if (process.env.DISABLE_EMAIL_SENDING === 'true') {
      console.log(`🔧 MODO DESARROLLO - Código de verificación para ${email}: ${verificationCode}`);
      console.log(`👤 Usuario: ${firstName}`);
      console.log(`⏰ Código válido por 15 minutos`);
      console.log(`📋 Copia este código para verificar: ${verificationCode}`);
      return;
    }

    const from = this.configService.get('EMAIL_FROM');
    
    const mailOptions = {
      from,
      to: email,
      subject: '🏨 CITYLIGHTS - Verificación de Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #1e3a8a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏨 CITYLIGHTS</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Sistema de Autenticación</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e40af; margin-bottom: 20px;">¡Hola ${firstName}!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Gracias por registrarte en CITYLIGHTS. Para completar tu registro, por favor verifica tu email usando el siguiente código:
            </p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #1e40af; padding: 20px; margin: 30px 0; text-align: center;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0;">Código de Verificación</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-top: 30px;">
              ⏰ Este código expira en 15 minutos<br>
              🔒 Si no solicitaste este registro, puedes ignorar este email
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © 2024 CITYLIGHTS - Sistema de Reservas y Autenticación
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email de verificación enviado a: ${email}`);
    } catch (error) {
      console.error('❌ Error enviando email de verificación:', error);
      throw new Error('Error enviando email de verificación');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string, role: string) {
    // Solo usar consola si está explícitamente deshabilitado
    if (process.env.DISABLE_EMAIL_SENDING === 'true') {
      console.log(`🎉 MODO DESARROLLO - Bienvenida para ${firstName} (${email}) con rol: ${role}`);
      return;
    }

    const from = this.configService.get('EMAIL_FROM');
    
    const mailOptions = {
      from,
      to: email,
      subject: '🎉 ¡Bienvenido a CITYLIGHTS!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #059669; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏨 CITYLIGHTS</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">¡Cuenta Verificada!</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #047857; margin-bottom: 20px;">¡Bienvenido ${firstName}! 🎉</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Tu cuenta ha sido verificada exitosamente. Ya puedes acceder a todos los servicios de CITYLIGHTS.
            </p>
            
            <div style="background-color: #ecfdf5; border-left: 4px solid #059669; padding: 20px; margin: 30px 0;">
              <h3 style="color: #047857; margin: 0 0 10px 0;">Información de tu cuenta</h3>
              <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Rol:</strong> ${role}</p>
              <p style="margin: 5px 0; color: #374151;"><strong>Estado:</strong> Activa ✅</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © 2024 CITYLIGHTS - Sistema de Reservas y Autenticación
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email de bienvenida enviado a: ${email}`);
    } catch (error) {
      console.error('❌ Error enviando email de bienvenida:', error);
      // No lanzamos error aquí para no interrumpir el proceso de verificación
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, verificationCode: string) {
    console.log(`🔐 Intentando enviar email de reset de contraseña a: ${email}`);
    
    // Solo usar consola si está explícitamente deshabilitado
    if (process.env.DISABLE_EMAIL_SENDING === 'true') {
      console.log(`🔧 MODO DESARROLLO - Código de reset para ${email}: ${verificationCode}`);
      console.log(`👤 Usuario: ${firstName}`);
      console.log(`⏰ Código válido por 15 minutos`);
      console.log(`🔑 Copia este código para restablecer contraseña: ${verificationCode}`);
      return;
    }

    const from = this.configService.get('EMAIL_FROM');
    
    const mailOptions = {
      from,
      to: email,
      subject: '🔐 CITYLIGHTS - Restablecimiento de Contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #dc2626; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🏨 CITYLIGHTS</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Restablecimiento de Contraseña</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #dc2626; margin-bottom: 20px;">¡Hola ${firstName}!</h2>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Has solicitado restablecer tu contraseña. Usa el siguiente código de verificación para crear una nueva contraseña:
            </p>
            
            <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
              <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px;">Código de Verificación</h3>
              <p style="font-size: 36px; font-weight: bold; color: #991b1b; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </p>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">⚠️ Importante</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>Este código es válido por <strong>15 minutos</strong></li>
                <li>Solo úsalo si realmente solicitaste cambiar tu contraseña</li>
                <li>Nunca compartas este código con nadie</li>
                <li>Si no solicitaste este cambio, ignora este email</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Si tienes problemas, contacta a nuestro equipo de soporte.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                © 2024 CITYLIGHTS - Sistema de Reservas y Autenticación
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`🔐 Email de reset de contraseña enviado a: ${email}`);
    } catch (error) {
      console.error('❌ Error enviando email de reset:', error);
      throw new Error('Error enviando email de reset de contraseña');
    }
  }
}