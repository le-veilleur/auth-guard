import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';

// Configuration du stream pour la rotation des fichiers
const accessLogStream = createStream('access.log', {
  interval: '1d', // Rotation quotidienne
  path: path.join('logs', 'http'),
  size: '10M', // Taille maximale du fichier
  compress: 'gzip', // Compression des anciens fichiers
});

// Format personnalisé pour les logs HTTP
const format = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Création du middleware Morgan avec configuration
const httpLogger = morgan(format, {
  stream: accessLogStream,
  // Ne log que les erreurs 4xx et 5xx en production
  skip: (req, res) => process.env.NODE_ENV === 'production' && res.statusCode < 400,
});

export default httpLogger; 