import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mediaHash, mixAudioStems } from "./local.js";
test('streamed hash is actual content, stable for same bytes', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dp-hash-'));
    try {
        const file = join(dir, 'data');
        await writeFile(file, 'abc');
        assert.equal(await mediaHash(file), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
        await writeFile(file, 'abcd');
        assert.notEqual(await mediaHash(file), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    }
    finally {
        await rm(dir, { recursive: true });
    }
});
test('invalid mix options fail before filesystem/process access', async () => {
    const input = { video: '/does-not-exist', dialogue: '/does-not-exist', background: '/does-not-exist', output: '/does-not-exist', frames: 25, fps: 25, backgroundGain: 0.2 };
    for (const patch of [{ frames: 0 }, { fps: 0 }, { backgroundGain: -1 }, { backgroundGain: NaN }])
        await assert.rejects(mixAudioStems({ ...input, ...patch }), /Invalid/);
});
test('assembly and mix respect pre-aborted signals before input access', async () => {
    const { concatenateFixture } = await import("./local.js");
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(concatenateFixture(['/missing'], '/missing', undefined, controller.signal), { name: 'AbortError' });
    await assert.rejects(mixAudioStems({ video: '/missing', dialogue: '/missing', background: '/missing', output: '/missing', frames: 25, fps: 25, backgroundGain: 0.2 }, undefined, controller.signal), { name: 'AbortError' });
});
test('runMedia abort stops an actual running child', async () => {
    const { runMedia } = await import("./local.js");
    const { readFile } = await import('node:fs/promises');
    const { setTimeout: delay } = await import('node:timers/promises');
    const directory = await mkdtemp(join(tmpdir(), 'dp-cancel-'));
    const pidFile = join(directory, 'pid');
    const controller = new AbortController();
    const child = runMedia(process.execPath, ['-e', "require('node:fs').writeFileSync(process.argv[1],String(process.pid));setInterval(()=>{},1000)", pidFile], controller.signal);
    const rejected = assert.rejects(child, { name: 'AbortError' });
    try {
        let pid = 0;
        for (let i = 0; i < 200; i++) {
            try {
                pid = Number(await readFile(pidFile, 'utf8'));
                break;
            }
            catch {
                await delay(10);
            }
        }
        assert.ok(pid > 0, 'child reported ready');
        controller.abort();
        await rejected;
        let alive = true;
        for (let i = 0; i < 200; i++) {
            try {
                process.kill(pid, 0);
                await delay(10);
            }
            catch {
                alive = false;
                break;
            }
        }
        assert.equal(alive, false, 'cancelled child exited');
    }
    finally {
        controller.abort();
        await rejected;
        await rm(directory, { recursive: true });
    }
});
