import subprocess
import json
import os
from celery.decorators import task
from celery.utils.log import get_task_logger

from swampdragon.pubsub_providers.data_publisher import publish_data

from noriv2apiserver.settings import RENDERER_DIR

logger = get_task_logger(__name__)


@task(name="render_image")
def render_image(input_file, output_file, userid):
    """Renders the image with the given paths and
    calls callback on every update"""
    logger.info('Started task')

    proc = subprocess.Popen(
        [os.path.join(RENDERER_DIR, 'build/nori'),
            input_file, '0', '0', '1'],
        stdout=subprocess.PIPE)
    logger.info('Started render process')
    while True:
        # read output and send to websockets
        line = proc.stdout.readline()
        if line != b'':
            try:
                data = json.loads(line.decode('utf8'))
                return_object = {
                    'url': output_file,
                    'percentage': data['percentage'],  # percentage
                    'finished': False
                }
                publish_data(channel='update-msg'.format(userid),
                             data=return_object)

            except json.JSONDecodeError as e:
                logger.debug('Error decoding json: {}\nInput: {}'.
                            format(e, line))
        else:
            break
    logger.info('Finished Task')

    return_object = {
        'url': output_file,
        'percentage': 100,
        'finished': True
    }
    publish_data(channel='update-msg'.format(userid), data=return_object)

    os.remove(input_file)
