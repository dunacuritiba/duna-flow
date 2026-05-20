export enum AttendanceStatus {
  AGUARDANDO_RECEPCAO = 'AGUARDANDO_RECEPCAO', // Chegou no prédio, está na fila do balcão
  NO_SAGUAO = 'NO_SAGUAO', // Fez o cadastro rápido, aguarda primeira chamada
  SALA_ESPERA_INTERNA = 'SALA_ESPERA_INTERNA', // Passou da recepção, aguarda na porta do consultório/sala
  EM_ATENDIMENTO = 'EM_ATENDIMENTO', // Está sendo atendido pelo profissional
  CONCLUIDO = 'CONCLUIDO', // Atendimento finalizado com sucesso
  CANCELADO = 'CANCELADO', // Desistiu ou foi cancelado
}
