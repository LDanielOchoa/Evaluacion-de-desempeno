from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from urllib.parse import urlparse
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://evaluacion-sand.vercel.app/"}})

# Parsear la URL de la base de datos
db_url = urlparse(os.getenv('URL_ENV_RAILWAY'))
db_host = db_url.hostname
db_port = db_url.port or os.getenv('PORT_ENV_RAILWAY')

# Configurar la conexión a la base de datos MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqldb://{os.getenv('USER_ENV_RAILWAY')}:{os.getenv('PASSWORD_ENV_RAILWAY')}@{db_host}:{db_port}/{os.getenv('DATABASE_ENV_RAILWAY')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Definir el modelo de Usuario actualizado
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

# Definir el modelo para las evaluaciones
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
            fecha_ingreso=f"{data['datos']['anoIngreso']}-{data['datos']['mesIngreso']}-01",
            antiguedad=data['datos']['antiguedad'],
            antiguedad_anios=str(datetime.now().year - int(data['datos']['anoIngreso'])),
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
        
        # Calcular total_puntos y porcentaje_calificacion
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
        new_evaluation.porcentaje_calificacion = f"{(total_puntos / 36) * 100:.2f}%"
        
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

print("Servidor backend en ejecución. Accede a la API en https://evaluacion-de-desempeno.onrender.com")
