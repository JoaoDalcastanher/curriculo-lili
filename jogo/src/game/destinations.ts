import type { Destination, SpaceBody } from './types'

/**
 * Lugares do planeta para o "poderia chegar até…". Depois da África, o Pingo
 * segue nadando (e às vezes andando) pelo caminho mais curto até cada lugar.
 * A distância de cada um é calculada, nunca escrita à mão.
 */
export const DESTINATIONS: readonly Destination[] = [
  { id: 'lagos', name: 'Lagos', region: 'Nigéria', at: { lat: 6.5, lon: 3.4 }, line: 'A maior cidade da África. Muito barulho para um pinguim tímido.', mood: 'calor' },
  { id: 'saara', name: 'Deserto do Saara', region: 'África', at: { lat: 23, lon: 10 }, line: 'Areia até onde a vista alcança. Nenhum peixe. Nenhuma sombra.', mood: 'calor' },
  { id: 'nairobi', name: 'Nairóbi', region: 'Quênia', at: { lat: -1.3, lon: 36.8 }, line: 'Safári! Foi fotografar uma girafa e teve que dar dez passos para trás para ela caber na foto.', mood: 'oculos' },
  { id: 'cabo', name: 'Cidade do Cabo', region: 'África do Sul', at: { lat: -33.9, lon: 18.4 }, line: 'Aqui vivem os pinguins-africanos. Primos! Hora de um refresco com a família.', mood: 'refresco' },
  { id: 'marrakech', name: 'Marrakech', region: 'Marrocos', at: { lat: 31.6, lon: -8.0 }, line: 'Chá de hortelã bem quente. Ele pediu com muito gelo.', mood: 'refresco' },
  { id: 'cairo', name: 'Cairo', region: 'Egito', at: { lat: 30.0, lon: 31.2 }, line: 'Entrou numa pirâmide e saiu todo enrolado: virou a primeira múmia-pinguim do Egito.', mood: 'oculos' },
  { id: 'madagascar', name: 'Madagascar', region: 'África', at: { lat: -18.9, lon: 47.5 }, line: 'Uma zebra, um leão, uma girafa e um hipopótamo cercaram o Pingo com uma única pergunta: cadê o Capitão?', mood: 'feliz' },
  { id: 'madri', name: 'Madri', region: 'Espanha', at: { lat: 40.4, lon: -3.7 }, line: 'Churros com chocolate. Nadadeiras melecadas.', mood: 'feliz' },
  { id: 'roma', name: 'Roma', region: 'Itália', at: { lat: 41.9, lon: 12.5 }, line: 'Virou gladiador no Coliseu: capacete, escudo e um peixe de espada contra um leão.', mood: 'pensativo' },
  { id: 'atenas', name: 'Atenas', region: 'Grécia', at: { lat: 38.0, lon: 23.7 }, line: 'Ficou tanto tempo parado admirando as ruínas que virou estátua. Até perdeu uma nadadeira.', mood: 'oculos' },
  { id: 'paris', name: 'Paris', region: 'França', at: { lat: 48.9, lon: 2.35 }, line: 'Boina, camiseta listrada e baguete debaixo da nadadeira. Bonjour!', mood: 'cansado' },
  { id: 'londres', name: 'Londres', region: 'Inglaterra', at: { lat: 51.5, lon: -0.13 }, line: 'Chuva o dia todo. Para um pinguim, finalmente um clima decente!', mood: 'feliz' },
  { id: 'berlim', name: 'Berlim', region: 'Alemanha', at: { lat: 52.5, lon: 13.4 }, line: 'Comprou um pretzel maior que a própria cabeça.', mood: 'feliz' },
  { id: 'dubai', name: 'Dubai', region: 'Emirados Árabes', at: { lat: 25.2, lon: 55.3 }, line: 'Lá tem pista de esqui dentro de um shopping. Ele não quis sair.', mood: 'frio' },
  { id: 'moscou', name: 'Moscou', region: 'Rússia', at: { lat: 55.75, lon: 37.6 }, line: 'Chapéu de pele, neve caindo e sopa quentinha. Ele aprovou.', mood: 'frio' },
  { id: 'nova-york', name: 'Nova York', region: 'Estados Unidos', at: { lat: 40.7, lon: -74.0 }, line: 'Fantasiado de Estátua da Liberdade. Ninguém reparou que era um pinguim.', mood: 'pensativo' },
  { id: 'everest', name: 'Monte Everest', region: 'Nepal', at: { lat: 27.99, lon: 86.9 }, line: 'O pico mais alto do mundo. Ele chegou ofegante, mas chegou.', mood: 'exausto' },
  { id: 'groenlandia', name: 'Groenlândia', region: 'Ártico', at: { lat: 64.2, lon: -51.7 }, line: 'Icebergs, aurora boreal e um narval. Paraíso, mas cadê os outros pinguins?', mood: 'frio' },
  { id: 'polo-norte', name: 'Polo Norte', region: 'Ártico', at: { lat: 89.9, lon: 0 }, line: 'Surpresa: no Polo Norte não tem pinguim nenhum. Só urso-polar. Corre, Pingo!', mood: 'frio' },
  { id: 'mexico', name: 'Cidade do México', region: 'México', at: { lat: 19.4, lon: -99.1 }, line: 'Tacos de peixe! Finalmente alguém que entende.', mood: 'feliz' },
  { id: 'singapura', name: 'Singapura', region: 'Ásia', at: { lat: 1.35, lon: 103.8 }, line: 'Chegou pilotando o próprio monomotor, de touca de couro, óculos e cachecol ao vento. Lá embaixo, 32 °C.', mood: 'calor' },
  { id: 'pequim', name: 'Pequim', region: 'China', at: { lat: 39.9, lon: 116.4 }, line: 'Caminhou na Muralha da China. São uns 21 mil km: 141 quadradinhos de muro!', mood: 'exausto' },
  { id: 'polo-sul', name: 'Polo Sul', region: 'Antártida', at: { lat: -89.9, lon: 0 }, line: 'Pinguins-imperadores por todo lado. Ele tirou selfie com a família inteira.', mood: 'frio' },
  { id: 'los-angeles', name: 'Los Angeles', region: 'Estados Unidos', at: { lat: 34.05, lon: -118.2 }, line: 'Hollywood quer o Pingo num filme. Ele pediu um camarim gelado.', mood: 'oculos' },
  { id: 'seul', name: 'Seul', region: 'Coreia do Sul', at: { lat: 37.6, lon: 127.0 }, line: 'Aprendeu uma coreografia de K-pop. Nadadeiras sincronizadas.', mood: 'feliz' },
  { id: 'toquio', name: 'Tóquio', region: 'Japão', at: { lat: 35.7, lon: 139.7 }, line: 'Sushi no café, no almoço e na janta. O melhor lugar do mundo.', mood: 'feliz' },
  { id: 'alasca', name: 'Anchorage', region: 'Alasca', at: { lat: 61.2, lon: -149.9 }, line: 'Um urso-polar jogou a vara para pescar o Pingo. Quem saiu com o peixe foi o Pingo.', mood: 'frio' },
  { id: 'sydney', name: 'Sydney', region: 'Austrália', at: { lat: -33.9, lon: 151.2 }, line: 'Arrumou briga com um canguru. Ninguém sabe quem começou, mas o canguru pediu revanche.', mood: 'canguru' },
  { id: 'havai', name: 'Havaí', region: 'Estados Unidos', at: { lat: 21.3, lon: -157.9 }, line: 'Colar de flores, prancha de surfe e protetor solar fator 100 no bico.', mood: 'refresco' },
]

/** Daqui em diante, nada no espaço: as viagens viram voltas ou planetas. */
export const SPACE_BODIES: readonly SpaceBody[] = [
  { id: 'lua', name: 'Lua', label: 'a Lua', km: 384_400, line: 'Não tem água, não tem peixe, mas a vista da Terra é linda.', color: '#c9c6bd', radius: 0.27 },
  { id: 'venus', name: 'Vênus', label: 'Vênus', km: 41_000_000, line: 'O planeta mais quente. Levou dois sorvetes e os dois derreteram.', color: '#e8c27a', radius: 0.95 },
  { id: 'marte', name: 'Marte', label: 'Marte', km: 78_000_000, line: 'Areia vermelha e dois satélites. Ele fincou uma bandeirinha de pinguim.', color: '#d0603e', radius: 0.53 },
  { id: 'sol', name: 'Sol', label: 'o Sol', km: 149_600_000, line: 'Uns 5.500 °C na superfície. Pelo menos o peixe assou rapidinho.', color: '#f8b13c', radius: 3.4 },
  { id: 'jupiter', name: 'Júpiter', label: 'Júpiter', km: 628_000_000, line: 'Cabem mais de mil Terras dentro dele. Ele se sentiu pequenininho.', color: '#d9a877', radius: 2.4 },
  { id: 'saturno', name: 'Saturno', label: 'Saturno', km: 1_280_000_000, line: 'Patinou nos anéis. Escorregou em todos.', color: '#e7cf94', radius: 2 },
  { id: 'netuno', name: 'Netuno', label: 'Netuno', km: 4_350_000_000, line: 'Azul, gelado e com ventos de 2.000 km/h. Segura o cachecol, Pingo!', color: '#5b84e0', radius: 1.2 },
  { id: 'plutao', name: 'Plutão', label: 'Plutão', km: 5_900_000_000, line: 'Pequeno, gelado e tem um coração desenhado no chão. O Pingo se apaixonou.', color: '#cdb9a6', radius: 0.3 },
  { id: 'proxima', name: 'Proxima Centauri', label: 'Proxima Centauri', km: 40_200_000_000_000, line: 'A estrela mais perto do Sol. Nem a luz chega lá em menos de 4 anos. De foguete, então…', color: '#ff7b5c', radius: 2.2 },
]
