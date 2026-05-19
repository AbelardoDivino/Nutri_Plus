-- Execute no MySQL do Nutri+ (uma vez)

ALTER TABLE usuarios ADD COLUMN peso DECIMAL(5,2) NULL;
ALTER TABLE usuarios ADD COLUMN idade INT NULL DEFAULT 30;
ALTER TABLE usuarios ADD COLUMN taxa_basal DECIMAL(7,2) NULL;

CREATE TABLE IF NOT EXISTS dietas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  cafe TEXT,
  almoco TEXT,
  janta TEXT,
  cafe_calorias DECIMAL(7,2) DEFAULT 0,
  almoco_calorias DECIMAL(7,2) DEFAULT 0,
  janta_calorias DECIMAL(7,2) DEFAULT 0,
  calorias_totais DECIMAL(7,2) DEFAULT 0,
  dieta_json JSON,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
