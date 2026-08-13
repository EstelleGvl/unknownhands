import json, os
p='data/heurist/relationships.json'
if not os.path.exists(p):
    print('no file', p)
else:
    try:
        with open(p,'r',encoding='utf-8') as f:
            data=json.load(f)
    except Exception as e:
        print('load failed', e)
        data=None
    if data is None:
        exit(0)
    print('type', type(data))
    if isinstance(data, list):
        print('len', len(data))
        for i, item in enumerate(data[:20]):
            print('--- item', i, '---')
            for k,v in list(item.items())[:20]:
                print(k,':', v)
    elif isinstance(data, dict):
        print('keys', list(data.keys())[:20])
        # print sample nested
        for k in list(data.keys())[:20]:
            print('key', k)
            print(data[k])
            break
