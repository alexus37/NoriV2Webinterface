from swampdragon import route_handler
from swampdragon.route_handler import BaseRouter
from celery.task.control import revoke


class UpdateMsgRouter(BaseRouter):
    route_name = 'update-msg'
    valid_verbs = [
        'subscribe', 'unsubscribe', 'control'
    ]

    def get_subscription_channels(self, **kwargs):
        return ['update-msg']

    def subscribe(self, **kwargs):
        super().subscribe(**kwargs)

    def control(self, **kwargs):
        if kwargs['command'] == 'cancel':
            revoke(kwargs['task_id'], terminate=True)
            self.send({'command': 'cancel', 'success': 'true'})
        else:
            self.send({'command': kwargs['command'],
                       'success': 'false',
                       'message': 'Unknown command'})

route_handler.register(UpdateMsgRouter)
