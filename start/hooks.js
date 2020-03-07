const { hooks } = use('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Exception = use('Exception');

  Exception.handle('ModelNotFoundException', async (error, { response }) => {
    response.status(404).send({
      message: 'Requested item was not found',
    });
  });
});
