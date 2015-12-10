from swampdragon import route_handler
from swampdragon.route_handler import BaseRouter


class UpdateMsgRouter(BaseRouter):
    route_name = 'update-msg'
    valid_verbs = [
        'subscribe', 'unsubscribe', 'ping'
    ]

    def subscribe(self, **kwargs):
        import ipdb; ipdb.set_trace() # channel has to be user-{id}
        super().subscribe(**kwargs)

    def ping(self, **kwargs):
        self.send({'pong': 'pong'})

route_handler.register(UpdateMsgRouter)
