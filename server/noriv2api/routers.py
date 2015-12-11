from swampdragon import route_handler
from swampdragon.route_handler import BaseRouter


class UpdateMsgRouter(BaseRouter):
    route_name = 'update-msg'
    valid_verbs = [
        'subscribe', 'unsubscribe'
    ]

    def get_subscription_channels(self, **kwargs):
        return ['update-msg']

    def subscribe(self, **kwargs):
        super().subscribe(**kwargs)

route_handler.register(UpdateMsgRouter)
