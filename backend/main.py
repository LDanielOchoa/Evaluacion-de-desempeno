from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
from datetime import datetime
import logging

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

db_url = urlparse(os.getenv('URL_ENV_RAILWAY'))
db_host = db_url.hostname
db_port = db_url.port or os.getenv('PORT_ENV_RAILWAY')

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqldb://{os.getenv('USER_ENV_RAILWAY')}:{os.getenv('PASSWORD_ENV_RAILWAY')}@{db_host}:{db_port}/{os.getenv('DATABASE_ENV_RAILWAY')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    CEDULA = db.Column(db.Integer, primary_key=True)
    NOMBRE = db.Column(db.String(512))
    CARGO = db.Column(db.String(512))
    CENTRO_DE_COSTO = db.Column('CENTRO DE COSTO', db.String(512))
    LIDER_EVALUADOR = db.Column('LIDER EVALUADOR', db.String(512))
    CARGO_DE_LIDER_EVALUADOR = db.Column('CARGO DE LIDER EVALUADOR', db.String(512))
    ESTADO = db.Column(db.String(512))
    ANO_INGRESO = db.Column('Año ingreso', db.Integer)
    MES_INGRESO = db.Column('mes ingreso', db.String(512))
    ANOS = db.Column('Años', db.Float)
    ANTIGUEDAD = db.Column('Antiguedad', db.String(512))
    CLAVE = db.Column(db.String(512))
    SEGURIDAD = db.Column(db.String(512))
    LIDER = db.Column(db.String(255))  # Added new LIDER column

class Evaluacion(db.Model):
    __tablename__ = 'Colaboradores'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    marca_temporal = db.Column(db.String(512))
    anio = db.Column(db.Integer)
    nombres_apellidos = db.Column(db.String(512))
    cedula = db.Column(db.Integer)
    cargo = db.Column(db.String(512))
    fecha_ingreso = db.Column(db.String(512))
    antiguedad = db.Column(db.String(512))
    antiguedad_anios = db.Column(db.String(512))
    nombre_jefe_inmediato = db.Column(db.String(512))
    area_jefe_pertenencia = db.Column(db.String(512))
    estado = db.Column(db.String(512))
    compromiso_pasion_entrega = db.Column(db.Integer)
    honestidad = db.Column(db.Integer)
    respeto = db.Column(db.Integer)
    sencillez = db.Column(db.Integer)
    servicio = db.Column(db.Integer)
    trabajo_equipo = db.Column(db.Integer)
    conocimiento_trabajo = db.Column(db.Integer)
    productividad = db.Column(db.Integer)
    cumple_sistema_gestion = db.Column(db.Integer)
    total_puntos = db.Column(db.Integer)
    porcentaje_calificacion = db.Column(db.String(512))
    porcentaje_promedio = db.Column(db.String(512))
    acuerdos_mejora_desempeno_colaborador = db.Column(db.String(512))
    formacion = db.Column(db.String(512))
    acuerdos_mejora_desempeno_jefe = db.Column(db.String(512))
    necesidades_desarrollo = db.Column(db.String(512))
    aspectos_positivos = db.Column(db.String(512))
    cargo_jefe_inmediato = db.Column(db.String(512))

@app.route('/get_all_evaluations', methods=['GET'])
def get_all_evaluations():
    try:
        evaluations = Evaluacion.query.all()
        return jsonify({
            "success": True,
            "evaluations": [
                {
                    "nombres_apellidos": eval.nombres_apellidos,
                    "cedula": eval.cedula,
                    "fecha_evaluacion": eval.marca_temporal,
                    "area_jefe_pertenencia": eval.area_jefe_pertenencia,
                    "anio": eval.anio,
                    "cargo": eval.cargo,
                    "compromiso": eval.compromiso_pasion_entrega,
                    "honestidad": eval.honestidad,
                    "respeto": eval.respeto,
                    "sencillez": eval.sencillez,
                    "servicio": eval.servicio,
                    "trabajo_equipo": eval.trabajo_equipo,
                    "conocimiento_trabajo": eval.conocimiento_trabajo,
                    "productividad": eval.productividad,
                    "cumple_sistema_gestion": eval.cumple_sistema_gestion,
                    "total_puntos": eval.total_puntos,
                    "porcentaje_calificacion": float(eval.porcentaje_calificacion),
                    "acuerdos_mejora_desempeno_colaborador": eval.acuerdos_mejora_desempeno_colaborador,
                    "acuerdos_mejora_desempeno_jefe": eval.acuerdos_mejora_desempeno_jefe,
                    "necesidades_desarrollo": eval.necesidades_desarrollo,
                    "aspectos_positivos": eval.aspectos_positivos
                } for eval in evaluations
            ]
        })
    except Exception as e:
        print(f"Error fetching evaluations: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/validate_cedula', methods=['POST'])
def validate_cedula():
    try:
        data = request.get_json()
        if not data or 'cedula' not in data:
            return jsonify({"error": "Se requiere la cédula"}), 400

        cedula = data['cedula']
        
        try:
            cedula = int(cedula)
        except ValueError:
            return jsonify({"error": "La cédula debe ser un número válido"}), 400

        user = Usuario.query.filter_by(CEDULA=cedula).first()

        if user:
            return jsonify({
                "valid": True,
                "nombre": user.NOMBRE,
                "cargo": user.CARGO,
                "centro_de_costo": user.CENTRO_DE_COSTO,
                "lider_evaluador": user.LIDER_EVALUADOR,
                "cargo_de_lider_evaluador": user.CARGO_DE_LIDER_EVALUADOR,
                "estado": user.ESTADO,
                "ano_ingreso": user.ANO_INGRESO,
                "mes_ingreso": user.MES_INGRESO,
                "anos": user.ANOS,
                "antiguedad": user.ANTIGUEDAD
            })
        else:
            return jsonify({
                "valid": False,
                "error": "Usuario no encontrado"
            }), 404

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
@app.route('/validate_user', methods=['POST'])
def validate_user():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Se requiere usuario y contraseña"}), 400

        username = str(data['username']).strip()
        password = str(data['password']) 

        user = Usuario.query.filter_by(CEDULA=username).first()

        if user:
            if str(user.CLAVE) == password:
                return jsonify({
                    "valid": True,
                    "nombre": user.NOMBRE,
                    "cargo": user.CARGO,
                    "centro_de_costo": user.CENTRO_DE_COSTO,
                    "lider_evaluador": user.LIDER_EVALUADOR,
                    "cargo_de_lider_evaluador": user.CARGO_DE_LIDER_EVALUADOR,
                    "estado": user.ESTADO,
                    "ano_ingreso": user.ANO_INGRESO,
                    "mes_ingreso": user.MES_INGRESO,
                    "anos": user.ANOS,
                    "antiguedad": user.ANTIGUEDAD,
                    "requiresSecurityUpdate": user.SEGURIDAD is None or user.SEGURIDAD == "",
                    "username": user.CEDULA,
                    "password": user.CLAVE
                })

        return jsonify({
            "valid": False,
            "error": "Usuario o contraseña incorrectos"
        }), 401

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/change_password', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        required_fields = ['CEDULA', 'oldPassword', 'newPassword', 'confirmPassword']

        if not data or any(field not in data for field in required_fields):
            return jsonify({"success": False, "error": "Todos los campos son obligatorios"}), 400

        CEDULA = data['CEDULA']
        old_password = data['oldPassword'].strip()
        new_password = data['newPassword'].strip()
        confirm_password = data['confirmPassword'].strip()

        logging.info(f"Intentando cambiar la contraseña para el usuario con CEDULA: {CEDULA}")

        if new_password != confirm_password:
            return jsonify({"success": False, "error": "La nueva contraseña y la confirmación no coinciden"}), 400

        user = Usuario.query.filter_by(CEDULA=CEDULA).first()

        if not user:
            logging.warning(f"Usuario no encontrado para CEDULA: {CEDULA}")
            return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

        if user.CLAVE != old_password:
            return jsonify({"success": False, "error": "La contraseña antigua es incorrecta"}), 400

        if old_password == new_password:
            return jsonify({"success": False, "error": "La nueva contraseña no puede ser igual a la antigua"}), 400

        user.CLAVE = new_password 
        db.session.commit()

        logging.info(f"Contraseña actualizada para el usuario con CEDULA: {CEDULA}")
        return jsonify({"success": True, "message": "Contraseña actualizada correctamente"}), 200

    except Exception as e:
        logging.error(f"Error en el servidor: {str(e)}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500

@app.route('/update_security_question', methods=['POST'])
def update_security_question():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'securityQuestion' not in data or 'securityAnswer' not in data:
            return jsonify({"error": "Se requieren todos los campos"}), 400

        username = data['username']
        security_question = data['securityQuestion']
        security_answer = data['securityAnswer']

        user = Usuario.query.filter_by(CEDULA=username).first()

        if user:
            user.SEGURIDAD = f"{security_question}:{security_answer}"
            db.session.commit()
            return jsonify({"success": True, "message": "Pregunta de seguridad actualizada con éxito"})
        else:
            return jsonify({"success": False, "error": "Usuario no encontrado"}), 404

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/submit_evaluation', methods=['POST'])
def submit_evaluation():
    try:
        data = request.get_json()
        
        new_evaluation = Evaluacion(
            marca_temporal=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            anio=datetime.now().year,
            nombres_apellidos=data['datos']['nombres'],
            cedula=data['datos']['cedula'],
            cargo=data['datos']['cargo'],
            nombre_jefe_inmediato=data['datos']['jefe'],
            area_jefe_pertenencia=data['datos']['area'],
            estado=data['datos'].get('estado', 'Activo'),
            compromiso_pasion_entrega=data['valores']['compromiso'],
            honestidad=data['valores']['honestidad'],
            respeto=data['valores']['respeto'],
            sencillez=data['valores']['sencillez'],
            servicio=data['valores'].get('servicio', 0),
            trabajo_equipo=data['valores'].get('trabajo_equipo', 0),
            conocimiento_trabajo=data['valores'].get('conocimiento_trabajo', 0),
            productividad=data['valores'].get('productividad', 0),
            cumple_sistema_gestion=data['valores'].get('cumple_sistema_gestion', 0),
            acuerdos_mejora_desempeno_colaborador=data['acuerdos']['colaborador_acuerdos'],
            acuerdos_mejora_desempeno_jefe=data['acuerdos']['jefe_acuerdos'],
            necesidades_desarrollo=data['acuerdos']['desarrollo_necesidades'],
            aspectos_positivos=data['acuerdos']['aspectos_positivos'],
            cargo_jefe_inmediato=data['datos']['cargoJefe']
        )
        
        total_puntos = (
            new_evaluation.compromiso_pasion_entrega +
            new_evaluation.honestidad +
            new_evaluation.respeto +
            new_evaluation.sencillez +
            new_evaluation.servicio +
            new_evaluation.trabajo_equipo +
            new_evaluation.conocimiento_trabajo +
            new_evaluation.productividad +
            new_evaluation.cumple_sistema_gestion
        )
        new_evaluation.total_puntos = total_puntos
        new_evaluation.porcentaje_calificacion = f"{(total_puntos / 36) * 100:.2f}"
        
        db.session.add(new_evaluation)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Evaluación guardada exitosamente"
        })
    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Error al guardar la evaluación"}), 500


@app.route('/get_evaluation_history', methods=['POST'])
def get_evaluation_history():
    try:
        data = request.get_json()
        if not data or 'cedula' not in data:
            return jsonify({"error": "Se requiere la cédula"}), 400

        cedula = data['cedula']
        
        evaluations = Evaluacion.query.filter_by(cedula=cedula).order_by(Evaluacion.marca_temporal.desc()).all()
        
        history = []
        for eval in evaluations:
            history.append({
                "fecha_evaluacion": eval.marca_temporal,
                "anio": eval.anio,
                "cargo": eval.cargo,
                "compromiso": eval.compromiso_pasion_entrega,
                "honestidad": eval.honestidad,
                "respeto": eval.respeto,
                "sencillez": eval.sencillez,
                "servicio": eval.servicio,
                "trabajo_equipo": eval.trabajo_equipo,
                "conocimiento_trabajo": eval.conocimiento_trabajo,
                "productividad": eval.productividad,
                "cumple_sistema_gestion": eval.cumple_sistema_gestion,
                "total_puntos": eval.total_puntos,
                "porcentaje_calificacion": eval.porcentaje_calificacion,
                "acuerdos_mejora_desempeno_colaborador": eval.acuerdos_mejora_desempeno_colaborador,
                "acuerdos_mejora_desempeno_jefe": eval.acuerdos_mejora_desempeno_jefe,
                "necesidades_desarrollo": eval.necesidades_desarrollo,
                "aspectos_positivos": eval.aspectos_positivos
            })
        
        return jsonify({
            "success": True,
            "history": history
        })
    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error al obtener el historial de evaluaciones"}), 500
    
@app.route('/get_security_question', methods=['POST'])
def get_security_question():
    try:
        data = request.get_json()
        if not data or 'username' not in data:
            return jsonify({"error": "Se requiere el nombre de usuario"}), 400

        username = data['username']
        user = Usuario.query.filter_by(CEDULA=username).first()

        if not user or not user.SEGURIDAD:
            return jsonify({"error": "Usuario no encontrado o sin pregunta de seguridad configurada"}), 404

        security_data = user.SEGURIDAD.split(':')
        if len(security_data) != 2:
            return jsonify({"error": "Formato de pregunta de seguridad inválido"}), 500

        question_id = security_data[0]
        
        questions = {
            "mascota": "¿Cuál es el nombre de tu mascota?",
            "fecha": "¿Cuál es tu fecha importante?",
            "palabra": "¿Cuál es tu palabra secreta?",
            "numero": "¿Cuál es tu número secreto?"
        }

        return jsonify({
            "success": True,
            "securityQuestion": questions.get(question_id, "Pregunta no encontrada")
        })

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/verify_security_answer', methods=['POST'])
def verify_security_answer():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'securityAnswer' not in data:
            return jsonify({"error": "Se requieren todos los campos"}), 400

        username = data['username']
        security_answer = data['securityAnswer']

        user = Usuario.query.filter_by(CEDULA=username).first()

        if not user or not user.SEGURIDAD:
            return jsonify({"error": "Usuario no encontrado"}), 404

        stored_answer = user.SEGURIDAD.split(':')[1]

        if security_answer.lower() == stored_answer.lower():
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Respuesta incorrecta"})

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route('/reset_password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'newPassword' not in data:
            return jsonify({"error": "Se requieren todos los campos"}), 400

        username = data['username']
        new_password = data['newPassword']

        user = Usuario.query.filter_by(CEDULA=username).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if len(new_password) < 8 or not any(c.isalpha() for c in new_password) or not any(c.isdigit() for c in new_password):
            return jsonify({"error": "La contraseña debe tener al menos 8 caracteres y contener letras y números"}), 400

        user.CLAVE = new_password
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Contraseña actualizada correctamente"
        })

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500
    

@app.route('/get_employees_under_leader', methods=['GET'])
def get_employees_under_leader():
    try:
        leader_cedula = request.args.get('cedula', type=str)  # Cambiado a str ya que LIDER es varchar
        if not leader_cedula:
            return jsonify({"error": "Se requiere la cédula del líder"}), 400

        # Buscar empleados que tienen al líder especificado
        employees = Usuario.query.filter_by(LIDER=leader_cedula).all()
        
        if not employees:
            return jsonify({
                "success": True,
                "employees": [],
                "message": "No se encontraron empleados para este líder"
            }), 200

        # Obtener los detalles del líder
        leader = Usuario.query.filter_by(CEDULA=int(leader_cedula)).first()
        if not leader:
            return jsonify({"error": "Líder no encontrado"}), 404

        employee_list = []
        for employee in employees:
            employee_list.append({
                "cedula": employee.CEDULA,
                "nombre": employee.NOMBRE,
                "cargo": employee.CARGO,
                "centro_de_costo": employee.CENTRO_DE_COSTO,
                "estado": employee.ESTADO,
                "lider_evaluador": employee.LIDER_EVALUADOR,
                "cargo_de_lider_evaluador": employee.CARGO_DE_LIDER_EVALUADOR
            })

        return jsonify({
            "success": True,
            "employees": employee_list,
            "leader_info": {
                "nombre": leader.NOMBRE,
                "cargo": leader.CARGO,
                "centro_de_costo": leader.CENTRO_DE_COSTO
            }
        }), 200

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500

@app.route('/historial', methods=['GET'])
def get_historial():
    cedula = request.args.get('cedula', type=int)
    if not cedula:
        return jsonify({"error": "Se requiere la cédula del usuario"}), 400

    usuario = Usuario.query.get(cedula)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if not (usuario.CARGO.startswith('DIRECTOR') or usuario.CARGO.startswith('COORDINADOR')):
        return jsonify({"error": "No tienes permiso para ver el historial"}), 403

    area = usuario.CENTRO_DE_COSTO
    query = Evaluacion.query.filter(Evaluacion.area_jefe_pertenencia == area)

    if usuario.CARGO.startswith('DIRECTOR'):
        query = query.filter(~Evaluacion.cargo.startswith('COORDINADOR'))
    elif usuario.CARGO.startswith('COORDINADOR'):
        query = query.filter(~Evaluacion.cargo.startswith('DIRECTOR'))

    evaluaciones = query.order_by(Evaluacion.marca_temporal.desc()).all()

    historial = []
    for evaluacion in evaluaciones:
        historial.append({
            "id": evaluacion.id,
            "nombre": evaluacion.nombres_apellidos,
            "cedula": evaluacion.cedula,
            "cargo": evaluacion.cargo,
            "fecha": evaluacion.marca_temporal,
            "puntaje_total": evaluacion.total_puntos,
            "porcentaje_calificacion": evaluacion.porcentaje_calificacion
        })

    return jsonify({
        "historial": historial,
        "nombre_lider": usuario.NOMBRE,
        "cargo_lider": usuario.CARGO
    }), 200

@app.route('/get_user_details', methods=['GET'])
def get_user_details():
    cedula = request.args.get('cedula', type=int)
    if not cedula:
        return jsonify({"error": "Se requiere la cédula del usuario"}), 400

    usuario = Usuario.query.get(cedula)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify({
        "cedula": usuario.CEDULA,
        "nombre": usuario.NOMBRE,
        "cargo": usuario.CARGO,
        "centro_de_costo": usuario.CENTRO_DE_COSTO,
        "fecha_ingreso": f"{usuario.ANO_INGRESO}-{usuario.MES_INGRESO}-01",
        "antiguedad": usuario.ANTIGUEDAD,
        "centro_de_costo": usuario.CENTRO_DE_COSTO,
        "lider_evaluador": usuario.LIDER_EVALUADOR,
        "cargo_de_lider_evaluador": usuario.CARGO_DE_LIDER_EVALUADOR,
        "estado": usuario.ESTADO,
        "ano_ingreso": usuario.ANO_INGRESO,
        "mes_ingreso": usuario.MES_INGRESO,
        "anos": usuario.ANOS,
        "antiguedad": usuario.ANTIGUEDAD
    }), 200
    
    
@app.route('/get_employee_stats', methods=['GET'])
def get_employee_stats():
    cedula = request.args.get('cedula')
    if not cedula:
        return jsonify({"error": "Se requiere la cédula del empleado"}), 400

    evaluaciones = Evaluacion.query.filter_by(cedula=cedula).all()

    if not evaluaciones:
        return jsonify({"error": "No se encontraron evaluaciones para este empleado"}), 404

    anios = sorted(set(eval.anio for eval in evaluaciones))
    resultados = {}

    for evaluacion in evaluaciones:
        resultados[evaluacion.anio] = {
            "total_puntos": evaluacion.total_puntos,
            "porcentaje_calificacion": evaluacion.porcentaje_calificacion,
            "compromiso": evaluacion.compromiso_pasion_entrega,
            "honestidad": evaluacion.honestidad,
            "respeto": evaluacion.respeto,
            "sencillez": evaluacion.sencillez,
            "servicio": evaluacion.servicio,
            "trabajo_en_equipo": evaluacion.trabajo_equipo,
            "conocimiento": evaluacion.conocimiento_trabajo,
            "productividad": evaluacion.productividad,
            "gestion": evaluacion.cumple_sistema_gestion
        }

    return jsonify({
        "anios": anios,
        "resultados": resultados
    })
    
@app.route('/')
def hello():
    return "Backend de Evaluación de Desempeño funcionando correctamente"

if __name__ == '__main__':
    with app.app_context():
        try:
            db.create_all()
            print("Tablas creadas exitosamente")
        except Exception as e:
            print(f"Error al crear las tablas: {str(e)}")
    
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

