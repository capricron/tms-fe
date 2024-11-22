import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "../env";
import Loading from "./Loading";

const Scancv = () => {
    const [name, setName] = useState("");
    const [cv, setCV] = useState<File | null>(null);
    const [listJob, setListJob] = useState([]); // State untuk menyimpan list pekerjaan
    const [selectedJob, setSelectedJob] = useState(""); // State untuk menyimpan pilihan dropdown
    const [loader, setLoader] = useState(true);
    const [result, setResult] = useState({}) as any;

    const [step, setStep] = useState(1)

    useEffect(() => {
        axios
            .get(`${API_URL}/job`)
            .then((res) => {
                setListJob(res.data.data);
            })
            .finally(() => {
                setLoader(false);
            });
    }, []); // Dependency array kosong agar hanya dijalankan saat komponen pertama kali di-mount

    const submitCv = async () => {
        if (!name || !cv || !selectedJob) {
            alert("Harap lengkapi semua inputan sebelum mengirim.");
            return;
        }
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("job_id", selectedJob);
        formData.append("cv", cv);
        
        try {
            setLoader(true)
            const response = await axios.post(`${API_URL}/candidate`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data.data);
            setStep(2)
            setResult(response.data.data)
        } catch (error) {
            console.error("Error mengirim CV:", error);
            alert("Terjadi kesalahan saat mengirim CV.");
        } finally {
            setLoader(false)
        }
    };

    return (
        <>
            {loader &&
                <Loading />
            }

            {
                step == 1 ? (
                    <div className="flex items-center justify-center min-h-screen bg-gray-100">
                        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Selamat Datang
                                </h5>
                            </a>
                            <p className="text-white">Masukan Nama Anda</p>
                            <input
                                type="text"
                                className="block p-2 w-full text-sm text-black bg-gray"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <br />
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Pilih Pekerjaan
                            </p>
                            <select
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                                value={selectedJob}
                                onChange={(e) => setSelectedJob(e.target.value)}
                            >
                                <option value="" disabled>
                                    -- Pilih Pekerjaan --
                                </option>
                                {listJob.map((job: any, index) => (
                                    <option key={index} value={job.id}>
                                        {job.name}
                                    </option>
                                ))}
                            </select>
                            <br />
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                Masukan CV Anda
                            </p>
                            <input
                                type="file"
                                className="block w-full p-2.5 text-sm text-gray-900"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setCV(e.target.files[0]);
                                    }
                                }}
                            />
                            <br />
                            <button
                                onClick={submitCv}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Scan CV anda
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-screen bg-gray-100">
                        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Hasil Kamu
                                </h5>
                            </a>
                            <p className="text-white">Nama: {result.name}</p>
                            <p className="text-white">Pekerjaan: {result.job}</p>
                            <p className="text-white">Kecocokan: {result.persentase} %</p>
                            <br />
                            <button
                                onClick={() => setStep(1)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Scan Lagi?
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Scancv;
