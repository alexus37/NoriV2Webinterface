import os
import glob
from noriv2apiserver.celery import app as celery_app
modules = glob.glob(os.path.dirname(__file__) + "/*.py")
__all__ = [os.path.basename(f)[:-3] for f in modules]
