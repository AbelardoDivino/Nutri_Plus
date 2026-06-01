-- Ordem correta: profissionais primeiro (referenciado por usuarios)
CREATE TABLE IF NOT EXISTS profissionais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  altura DECIMAL(5,2),
  genero VARCHAR(20),
  sedentario VARCHAR(5),
  peso DECIMAL(5,2),
  idade INT DEFAULT 30,
  profissional_id INT,
  taxa_basal DECIMAL(7,2),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE SET NULL
);

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
