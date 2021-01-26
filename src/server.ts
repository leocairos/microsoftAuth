import app from './app';
import router from './routes';

(async () => {

  try {
    const port = parseInt(`${process.env.PORT}`);

    await app(router).listen(port);
    console.log(`[${process.env.MS_NAME}] Running on port ${port}...`);

  } catch (error) {
    console.log(`${error}`);
  }

})();