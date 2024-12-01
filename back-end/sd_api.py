import base64
import json
import urllib.request
import os
import time
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()


def timestamp():
    return datetime.fromtimestamp(time.time()).strftime("%Y%m%d-%H%M%S")


def encode_file_to_base64(path):
    with open(path, 'rb') as file:
        return base64.b64encode(file.read()).decode('utf-8')


def decode_and_save_base64(base64_str, save_path):
    with open(save_path, "wb") as file:
        file.write(base64.b64decode(base64_str))


def call_api(api_endpoint, webui_server_url, **payload):
    data = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(
        f'{webui_server_url}/{api_endpoint}',
        headers={'Content-Type': 'application/json'},
        data=data,
    )
    response = urllib.request.urlopen(request)
    return json.loads(response.read().decode('utf-8'))


def call_txt2img_api(webui_server_url, out_dir_t2i, **payload):
    response = call_api('sdapi/v1/txt2img', webui_server_url, **payload)
    save_paths = []
    for index, image in enumerate(response.get('images')):
        save_path = os.path.join(out_dir_t2i, f'txt2img-{timestamp()}-{index}.png')
        save_paths.append(save_path)
        decode_and_save_base64(image, save_path)
    return save_path


def make_image_from_prompt(prompt):
    webui_server_url = os.getenv('SD_URL')
    out_dir = 'final_images'
    out_dir_i2i = out_dir
    os.makedirs(out_dir_i2i, exist_ok=True)
    batch_size = 1
    
    brainrot = "(skibidi:0.1), (gyatt:0.1), (rizz:0.1), (only in ohio:0.1), (did you pray today:0.1), (livvy dunne:0.1), (rizzing up:0.1), (baby gronk:0.1), (sussy imposter:0.1), (pibby glitch:0.1), (in real life:0.1), (sigma:0.1), (alpha:0.1), (omega male grindset:0.1), (goon cave:0.1)"

    payload = {
            "prompt": "masterpiece, landscape, background," + brainrot + "," + prompt,  # extra networks also in prompts
            "negative_prompt": "lowres, text, error, nsfw, cropped, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, out of frame, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, username, watermark, signature",
            "steps": 10,
            "width": 820,
            "height": 512,
            "cfg_scale": 5,
            "sampler_name": "DPM++ 2M",
            "n_iter": 1,
            "batch_size": 1,
    }


    save_paths = call_txt2img_api(webui_server_url, out_dir_i2i, **payload)
    return (save_paths)

