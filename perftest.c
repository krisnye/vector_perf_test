#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <sys/time.h>
#include <math.h>

// const long size = 2000000;
// double memory[count];

double timedifference_msec(struct timeval t0, struct timeval t1)
{
    return (t1.tv_sec - t0.tv_sec) * 1000.0f + (t1.tv_usec - t0.tv_usec) / 1000.0f;
}

struct Vector {
    double x;
    double y;
    double z;
};

struct Vector v(double x, double y, double z) {
    struct Vector nv;
    nv.x = x;
    nv.y = y;
    nv.z = z;
    return nv;
}

struct Vector scale(struct Vector* v1, double value) {
    return v(
        v1->x * value,
        v1->y * value,
        v1->z * value);
}

struct Vector add(struct Vector* v1, struct Vector* v2) {
    return v(
        v1->x + v2->x,
        v1->y + v2->y,
        v1->z + v2->z);
}

double dot(struct Vector* v1, struct Vector* v2) {
    return 
        v1->x * v2->x +
        v1->y * v2->y +
        v1->z * v2->z;
}

double sum(struct Vector* v1) {
    return v1->x + v1->y + v1->z;
}

void normalize(struct Vector* v) {
    double invLength = 1.0f / sqrt(v->x * v->x + v->y * v->y + v->z * v->z);
    v->x *= invLength;
    v->y *= invLength;
    v->z *= invLength;
}

struct Vector cross(struct Vector* v1, struct Vector* v2) {
    double ax = v1->x, ay = v1->y, az = v1->z;
    double bx = v2->x, by = v2->y, bz = v2->z;

    return v(
        ay * bz - az * by,
        az * bx - ax * bz,
        ax * by - ay * bx
    );
}

double fn() {
    struct Vector v1 = v(1, 2, 3);
    struct Vector v2 = v(4, 5, 6);

    v1 = add(&v1, &v2);
    normalize(&v1);
    v1 = cross(&v1, &v2);

    return v1.x - v1.y + v1.z;
}

// function testObjects() {
//     let total = 0
//     for (let k = 0; k < size; k++) {
//         total += items[k].sum()
//     }
//     return total
// }

int main()
{
    const int count = 5;
    const int size = 2000000;

    struct Vector addMe = v(1, 0.5, 2);
    struct Vector dotMe = v(2, 0.5, 1);

    struct timeval t0;
    struct timeval t1;
    double elapsed;
    gettimeofday(&t0, 0);

    struct Vector* items = malloc(size * sizeof(struct Vector));
    for (int k = 0; k < size; k++) {
        items[k] = v(k / 2, k / 2, - k / 8);
    }
    for (int i = 0; i < count; i++) {
        for (int k = 0; k < size; k++) {
            struct Vector* item = &items[k];
            struct Vector added = add(item, &addMe);
            double dotted = dot(&added, &dotMe);
            items[k] = scale(item, dotted);
        }
    }
    double result = 0;
    for (int k = 0; k < size; k++) {
        result += sum(items + k);
    }

    gettimeofday(&t1, 0);
    elapsed = timedifference_msec(t0, t1);
    struct Vector v1 = v(1, 2, 3);

    free(items);
    // printf() displays the string inside quotation
    printf("result: %.10e, elapsed: %f, Ops/sec: %fM\n", result, elapsed, (count / elapsed) / 1000.0);
    return 0;
}
