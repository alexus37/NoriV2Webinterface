from swampdragon import route_handler
from swampdragon.route_handler import BaseRouter


class UpdateMsgRouter(BaseRouter):
    route_name = 'update-msg'
    valid_verbs = [
        'subscribe', 'unsubscribe'
    ]

    def subscribe(self, **kwargs):
        import ipdb; ipdb.set_trace() # channel has to be user-{id}
        super().subscribe(**kwargs)

route_handler.register(UpdateMsgRouter)
